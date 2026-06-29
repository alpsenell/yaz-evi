import { describe, it, expect } from 'vitest'
import { WHATSAPP_NUMBER, buildWhatsAppUrl, buildBookingWhatsAppText } from './whatsapp'

describe('WHATSAPP_NUMBER', () => {
  it('is the chosen booking line in wa.me format', () => {
    expect(WHATSAPP_NUMBER).toBe('905324316734')
  })
})

describe('buildWhatsAppUrl', () => {
  it('returns the base url with no text', () => {
    expect(buildWhatsAppUrl()).toBe(`https://wa.me/${WHATSAPP_NUMBER}`)
  })

  it('appends url-encoded text', () => {
    expect(buildWhatsAppUrl('Merhaba dünya')).toBe(
      `https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba%20d%C3%BCnya`,
    )
  })
})

describe('buildBookingWhatsAppText', () => {
  const full = { roomName: 'Zeus', checkIn: '12 Tem 2026', checkOut: '15 Tem 2026', nights: 3, guests: 2 }

  it('builds a Turkish booking message with all details', () => {
    const text = buildBookingWhatsAppText(full, 'tr')
    expect(text).toContain('Zeus')
    expect(text).toContain('12 Tem 2026')
    expect(text).toContain('15 Tem 2026')
    expect(text).toContain('3 gece')
    expect(text).toContain('2 kişi')
  })

  it('builds an English booking message', () => {
    const text = buildBookingWhatsAppText(full, 'en')
    expect(text.toLowerCase()).toContain('book')
    expect(text).toContain('Zeus')
    expect(text).toContain('3 nights')
  })

  it('falls back to a room inquiry when dates are missing', () => {
    expect(buildBookingWhatsAppText({ roomName: 'Hera' }, 'tr')).toContain('Hera')
  })

  it('falls back to a generic message when nothing is provided', () => {
    expect(buildBookingWhatsAppText({}, 'en').length).toBeGreaterThan(0)
    expect(buildBookingWhatsAppText().length).toBeGreaterThan(0)
  })
})
