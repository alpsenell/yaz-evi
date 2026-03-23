import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../_lib/firebase-admin'
import { getIyzipay } from '../_lib/iyzico'
import { Timestamp } from 'firebase-admin/firestore'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Missing token' })
    }

    const db = getDb()
    const iyzipay = getIyzipay()

    // Retrieve payment result from iyzico
    const result = await new Promise<any>((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ token }, (err: any, result: any) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    const bookingId = result.conversationId
    if (!bookingId) {
      return res.status(400).json({ message: 'Invalid payment result' })
    }

    // Find the booking document
    // We need to search across all rooms since we only have the bookingId
    const roomsSnapshot = await db.collection('rooms').get()
    let bookingDocRef = null
    let bookingRoomId = ''

    for (const roomDoc of roomsSnapshot.docs) {
      const bookingDoc = await roomDoc.ref.collection('bookings').doc(bookingId).get()
      if (bookingDoc.exists) {
        bookingDocRef = bookingDoc.ref
        bookingRoomId = roomDoc.id
        break
      }
    }

    if (!bookingDocRef) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const baseUrl = `${protocol}://${host}`

    if (result.paymentStatus === 'SUCCESS' || result.status === 'success') {
      // Payment successful - confirm booking
      await bookingDocRef.update({
        status: 'confirmed',
        paymentId: result.paymentId || '',
        updatedAt: Timestamp.now(),
      })

      return res.redirect(303, `${baseUrl}/booking/confirmation/${bookingId}?status=success`)
    } else {
      // Payment failed - cancel booking
      await bookingDocRef.update({
        status: 'cancelled',
        updatedAt: Timestamp.now(),
      })

      return res.redirect(303, `${baseUrl}/booking/confirmation/${bookingId}?status=failed`)
    }
  } catch (error) {
    console.error('Payment callback error:', error)

    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const baseUrl = `${protocol}://${host}`

    return res.redirect(303, `${baseUrl}/booking/confirmation/error?status=failed`)
  }
}
