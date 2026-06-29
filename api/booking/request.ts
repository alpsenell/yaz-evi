import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { getDb } from '../_lib/firebase-admin'
import { buildBookingEmail, formatDate, validateBookingPayload } from './request-helpers'

const FROM_EMAIL = process.env.BOOKING_FROM_EMAIL || 'bookings@yaz-evi.com'
const TO_EMAIL = process.env.BOOKING_TO_EMAIL || 'info@yaz-evi.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const body = req.body || {}
    const { roomId, checkIn, checkOut, nights, guests, guest, locale } = body

    const validation = validateBookingPayload(body)
    if (!validation.ok) {
      // Honeypot tripped — pretend success so bots get no signal.
      if (validation.reason === 'honeypot') {
        return res.status(200).json({ ok: true })
      }
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured')
      return res.status(500).json({ message: 'Email service not configured' })
    }

    // Server-side room truth (name + indicative price). Best-effort: the request
    // email must still send even if Firestore is unavailable.
    let roomName = ''
    let pricePerNight = 0
    try {
      const db = getDb()
      const roomDoc = await db.collection('rooms').doc(String(roomId)).get()
      if (roomDoc.exists) {
        const data = roomDoc.data() || {}
        roomName = data.name || ''
        pricePerNight = Number(data.pricePerNight) || 0
      }
    } catch (e) {
      console.error('Failed to read room for booking request:', e)
    }

    const loc = locale === 'en' ? 'en' : 'tr'
    const indicativeTotal =
      pricePerNight > 0
        ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
            pricePerNight * Number(nights),
          )
        : '—'

    const { subject, html, text } = buildBookingEmail({
      roomName,
      roomId: String(roomId),
      checkInFmt: formatDate(String(checkIn), loc),
      checkOutFmt: formatDate(String(checkOut), loc),
      nights: Number(nights),
      guests: guests != null ? Number(guests) : undefined,
      indicativeTotal,
      guest,
    })

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: guest.email,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(502).json({ message: 'Failed to send request' })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Booking request error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
