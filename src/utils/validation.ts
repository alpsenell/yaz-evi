export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const turkishPhoneRegex = /^\+90 \(5\d{2}\) \d{3} \d{2} \d{2}$/

// Formats raw input as "+90 (5XX) XXX XX XX", stripping a leading 90 country code
export function formatTurkishPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')

  if (digits.startsWith('90')) {
    digits = digits.slice(2)
  }

  digits = digits.slice(0, 10)

  let formatted = '+90 '
  if (digits.length > 0) {
    formatted += '(' + digits.slice(0, 3)
    if (digits.length >= 3) {
      formatted += ') '
    }
    if (digits.length > 3) {
      formatted += digits.slice(3, 6)
    }
    if (digits.length > 6) {
      formatted += ' ' + digits.slice(6, 8)
    }
    if (digits.length > 8) {
      formatted += ' ' + digits.slice(8, 10)
    }
  }

  return formatted
}
