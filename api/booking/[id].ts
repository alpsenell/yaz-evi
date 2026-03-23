import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../_lib/firebase-admin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing booking ID' })
    }

    const db = getDb()

    // Search for the booking across all rooms
    const roomsSnapshot = await db.collection('rooms').get()
    let bookingData = null

    for (const roomDoc of roomsSnapshot.docs) {
      const bookingDoc = await roomDoc.ref.collection('bookings').doc(id).get()
      if (bookingDoc.exists) {
        bookingData = bookingDoc.data()
        break
      }
    }

    if (!bookingData) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Return non-sensitive booking details
    return res.status(200).json({
      bookingRef: bookingData.bookingRef,
      roomName: bookingData.roomName,
      checkInDate: bookingData.checkInDate?.toDate?.()?.toISOString() || bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate?.toDate?.()?.toISOString() || bookingData.checkOutDate,
      nights: bookingData.nights,
      paidAmount: bookingData.paidAmount,
      status: bookingData.status,
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
    })
  } catch (error) {
    console.error('Booking fetch error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
