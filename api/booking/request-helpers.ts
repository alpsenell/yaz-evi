// Pure, framework-free helpers for the booking-request endpoint.
// Extracted from request.ts so the security-relevant logic (HTML escaping of
// guest input, validation, honeypot) is unit-testable without a Vercel/Firestore
// harness.

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export interface BookingGuest {
  name?: string
  email?: string
  phone?: string
  specialRequests?: string
}

export interface BookingRequestBody {
  roomId?: unknown
  checkIn?: unknown
  checkOut?: unknown
  nights?: unknown
  guests?: unknown
  guest?: BookingGuest
  locale?: unknown
  company?: unknown
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: 'honeypot' | 'missing' }

export function validateBookingPayload(body: BookingRequestBody): ValidationResult {
  // Honeypot: real users never fill the hidden "company" field.
  if (body.company) return { ok: false, reason: 'honeypot' }

  const g = body.guest
  if (
    !body.roomId ||
    !body.checkIn ||
    !body.checkOut ||
    !body.nights ||
    !g?.name ||
    !g?.email ||
    !g?.phone
  ) {
    return { ok: false, reason: 'missing' }
  }

  return { ok: true }
}

export interface EmailContentInput {
  roomName: string
  roomId: string
  checkInFmt: string
  checkOutFmt: string
  nights: number
  guests?: number
  indicativeTotal: string
  guest: Required<Pick<BookingGuest, 'name' | 'email' | 'phone'>> & Pick<BookingGuest, 'specialRequests'>
}

export interface BookingEmail {
  subject: string
  html: string
  text: string
}

export function buildBookingEmail(input: EmailContentInput): BookingEmail {
  const roomLabel = input.roomName || input.roomId

  const rows: Array<[string, string]> = [
    ['Oda / Room', roomLabel],
    ['Giriş / Check-in', input.checkInFmt],
    ['Çıkış / Check-out', input.checkOutFmt],
    ['Gece / Nights', String(input.nights)],
    ['Kişi / Guests', String(input.guests ?? '—')],
    ['Tahmini Tutar / Indicative total', input.indicativeTotal],
    ['İsim / Name', input.guest.name],
    ['E-posta / Email', input.guest.email],
    ['Telefon / Phone', input.guest.phone],
    ['Not / Notes', input.guest.specialRequests || '—'],
  ]

  const html = `
      <h2 style="font-family:sans-serif">Yeni Rezervasyon Talebi / New Booking Request</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="font-weight:bold;border:1px solid #eee">${escapeHtml(
                k,
              )}</td><td style="border:1px solid #eee">${escapeHtml(v)}</td></tr>`,
          )
          .join('')}
      </table>
    `

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')
  const subject = `Yeni Rezervasyon Talebi – ${roomLabel} (${input.checkInFmt} – ${input.checkOutFmt})`

  return { subject, html, text }
}
