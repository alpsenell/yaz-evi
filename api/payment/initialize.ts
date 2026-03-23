import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../_lib/firebase-admin'
import { getIyzipay } from '../_lib/iyzico'
import { Timestamp } from 'firebase-admin/firestore'

function generateBookingRef(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `YE-${date}-${code}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { roomId, checkIn, checkOut, nights, guest, locale } = req.body

    if (!roomId || !checkIn || !checkOut || !nights || !guest?.name || !guest?.email || !guest?.phone) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const db = getDb()
    const iyzipay = getIyzipay()

    // Fetch room price from Firestore (server-side truth)
    const roomDoc = await db.collection('rooms').doc(roomId).get()
    if (!roomDoc.exists) {
      return res.status(404).json({ message: 'Room not found' })
    }

    const roomData = roomDoc.data()!
    const pricePerNight = roomData.pricePerNight
    if (!pricePerNight || pricePerNight <= 0) {
      return res.status(400).json({ message: 'Room price not configured' })
    }

    const totalPrice = pricePerNight * nights

    // Check availability with transaction
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    const bookingsRef = db.collection('rooms').doc(roomId).collection('bookings')
    const overlapping = await bookingsRef
      .where('status', '==', 'confirmed')
      .where('checkInDate', '<', Timestamp.fromDate(checkOutDate))
      .where('checkOutDate', '>', Timestamp.fromDate(checkInDate))
      .get()

    if (!overlapping.empty) {
      return res.status(409).json({ message: 'Room is not available for the selected dates' })
    }

    // Create pending booking
    const bookingRef = generateBookingRef()
    const now = Timestamp.now()

    const bookingDoc = await bookingsRef.add({
      checkInDate: Timestamp.fromDate(checkInDate),
      checkOutDate: Timestamp.fromDate(checkOutDate),
      nights,
      guestName: guest.name,
      guestEmail: guest.email,
      guestPhone: guest.phone,
      specialRequests: guest.specialRequests || '',
      status: 'pending',
      paymentId: '',
      paymentToken: '',
      paidAmount: totalPrice,
      pricePerNight,
      roomId,
      roomName: roomData.name || '',
      locale: locale || 'tr',
      createdAt: now,
      updatedAt: now,
      bookingRef,
    })

    const bookingId = bookingDoc.id

    // Determine callback URL
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const baseUrl = `${protocol}://${host}`

    // Create iyzico checkout form
    const request = {
      locale: locale === 'tr' ? 'tr' : 'en',
      conversationId: bookingId,
      price: totalPrice.toFixed(2),
      paidPrice: totalPrice.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: bookingRef,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${baseUrl}/api/payment/callback`,
      enabledInstallments: [1, 2, 3, 6],
      buyer: {
        id: bookingId,
        name: guest.name.split(' ')[0] || guest.name,
        surname: guest.name.split(' ').slice(1).join(' ') || guest.name,
        gsmNumber: guest.phone,
        email: guest.email,
        identityNumber: '11111111111', // Required by iyzico, placeholder for guests
        registrationAddress: 'Bozcaada',
        ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket?.remoteAddress || '127.0.0.1',
        city: 'Canakkale',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: guest.name,
        city: 'Canakkale',
        country: 'Turkey',
        address: 'Bozcaada',
      },
      billingAddress: {
        contactName: guest.name,
        city: 'Canakkale',
        country: 'Turkey',
        address: 'Bozcaada',
      },
      basketItems: [
        {
          id: roomId,
          name: `${roomData.name || 'Room'} - ${nights} ${locale === 'tr' ? 'Gece' : 'Nights'}`,
          category1: 'Hotel',
          category2: 'Room Booking',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: totalPrice.toFixed(2),
        },
      ],
    }

    // Use iyzipay SDK to create checkout form
    const Iyzipay = (await import('iyzipay')).default

    const result = await new Promise<any>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    if (result.status !== 'success') {
      // Clean up pending booking on failure
      await bookingsRef.doc(bookingId).delete()
      return res.status(400).json({
        message: result.errorMessage || 'Failed to initialize payment',
      })
    }

    // Store payment token in booking
    await bookingsRef.doc(bookingId).update({
      paymentToken: result.token,
      updatedAt: Timestamp.now(),
    })

    return res.status(200).json({
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
      bookingId,
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}
