import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  formatDate,
  validateBookingPayload,
  buildBookingEmail,
} from './request-helpers'

describe('escapeHtml', () => {
  it('escapes the dangerous HTML characters', () => {
    expect(escapeHtml('&')).toBe('&amp;')
    expect(escapeHtml('<')).toBe('&lt;')
    expect(escapeHtml('>')).toBe('&gt;')
    expect(escapeHtml('"')).toBe('&quot;')
  })

  it('neutralizes a script-injection attempt', () => {
    const malicious = '<script>alert("xss")</script>'
    const escaped = escapeHtml(malicious)
    expect(escaped).not.toContain('<script>')
    expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
  })

  it('leaves safe text untouched', () => {
    expect(escapeHtml('Ada Lovelace')).toBe('Ada Lovelace')
  })
})

describe('formatDate', () => {
  it('formats a valid ISO date', () => {
    const out = formatDate('2026-07-12T00:00:00.000Z', 'en')
    expect(out).toMatch(/2026/)
  })

  it('returns the raw input on an invalid date input', () => {
    expect(formatDate('not-a-date', 'tr')).toBe('not-a-date')
  })
})

describe('validateBookingPayload', () => {
  const valid = {
    roomId: '1',
    checkIn: '2026-07-12',
    checkOut: '2026-07-15',
    nights: 3,
    guest: { name: 'A', email: 'a@b.com', phone: '+90 555' },
  }

  it('accepts a complete payload', () => {
    expect(validateBookingPayload(valid)).toEqual({ ok: true })
  })

  it('flags the honeypot when company is filled', () => {
    expect(validateBookingPayload({ ...valid, company: 'bot' })).toEqual({
      ok: false,
      reason: 'honeypot',
    })
  })

  it('rejects a missing required field', () => {
    expect(validateBookingPayload({ ...valid, guest: { name: 'A', email: '', phone: '+90' } })).toEqual({
      ok: false,
      reason: 'missing',
    })
  })

  it('rejects an entirely empty payload', () => {
    expect(validateBookingPayload({}).ok).toBe(false)
  })
})

describe('buildBookingEmail', () => {
  const base = {
    roomName: 'Zeus',
    roomId: '1',
    checkInFmt: '12 Tem 2026',
    checkOutFmt: '15 Tem 2026',
    nights: 3,
    guests: 2,
    indicativeTotal: '₺15.000,00',
    guest: { name: 'Ada', email: 'ada@example.com', phone: '+90 555 111 22 33' },
  }

  it('builds subject, html and text with the booking details', () => {
    const { subject, html, text } = buildBookingEmail(base)
    expect(subject).toContain('Zeus')
    expect(subject).toContain('12 Tem 2026')
    expect(html).toContain('Ada')
    expect(html).toContain('ada@example.com')
    expect(text).toContain('Zeus')
    expect(text).toContain('Gece / Nights: 3')
  })

  it('HTML-escapes malicious guest input in the email body', () => {
    const { html } = buildBookingEmail({
      ...base,
      guest: { name: '<img src=x onerror=alert(1)>', email: 'a@b.com', phone: '"><b>x' },
    })
    expect(html).not.toContain('<img src=x onerror=alert(1)>')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(html).not.toContain('"><b>x')
  })

  it('falls back to roomId and a dash for missing optional fields', () => {
    const { html } = buildBookingEmail({
      ...base,
      roomName: '',
      guests: undefined,
      guest: { name: 'Ada', email: 'a@b.com', phone: '+90' },
    })
    expect(html).toContain('1') // roomId fallback
    expect(html).toContain('—') // missing guests / notes
  })
})
