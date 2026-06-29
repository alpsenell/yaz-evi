// Single source of truth for the hotel's WhatsApp line (wa.me digits-only format).
export const WHATSAPP_NUMBER = '905324316734'

export function buildWhatsAppUrl(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export interface BookingMessageInput {
  roomName?: string
  /** Already-formatted, human-readable check-in date. */
  checkIn?: string
  /** Already-formatted, human-readable check-out date. */
  checkOut?: string
  nights?: number
  guests?: number
}

/**
 * Builds a prefilled WhatsApp message from the current booking selection.
 * Degrades gracefully: full booking → room inquiry → generic inquiry.
 */
export function buildBookingWhatsAppText(input: BookingMessageInput = {}, locale = 'tr'): string {
  const isTr = locale !== 'en'
  const { roomName, checkIn, checkOut, nights, guests } = input
  const hasDates = Boolean(checkIn && checkOut)

  if (roomName && hasDates) {
    const parts: string[] = []
    if (nights) parts.push(isTr ? `${nights} gece` : `${nights} nights`)
    if (guests) parts.push(isTr ? `${guests} kişi` : `${guests} guests`)
    const detail = parts.length ? ` (${parts.join(', ')})` : ''
    return isTr
      ? `Merhaba, ${roomName} odası için ${checkIn} - ${checkOut}${detail} rezervasyon yapmak istiyorum.`
      : `Hello, I'd like to book the ${roomName} room for ${checkIn} - ${checkOut}${detail}.`
  }

  if (roomName) {
    return isTr
      ? `Merhaba, ${roomName} odası hakkında bilgi almak istiyorum.`
      : `Hello, I'd like more information about the ${roomName} room.`
  }

  return isTr
    ? 'Merhaba, Yaz Evi Bozcaada hakkında bilgi almak istiyorum.'
    : "Hello, I'd like more information about Yaz Evi Bozcaada."
}
