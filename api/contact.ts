import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const turkishPhoneRegex = /^\+90 \(5\d{2}\) \d{3} \d{2} \d{2}$/

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, phone, message, locale, website } = req.body ?? {}

    // Honeypot: hidden field bots fill in — report success, send nothing
    if (typeof website === 'string' && website.trim() !== '') {
      return res.status(200).json({ ok: true })
    }

    if (typeof name !== 'string' || name.trim() === '' || name.trim().length > 100) {
      return res.status(400).json({ message: 'Invalid name' })
    }
    if (typeof email !== 'string' || email.trim().length > 200 || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Invalid email' })
    }
    if (typeof message !== 'string' || message.trim() === '' || message.trim().length > 5000) {
      return res.status(400).json({ message: 'Invalid message' })
    }
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : ''
    if (trimmedPhone !== '' && !turkishPhoneRegex.test(trimmedPhone)) {
      return res.status(400).json({ message: 'Invalid phone' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const timestamp = new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Europe/Istanbul',
    }).format(new Date())

    const rows: Array<[string, string]> = [
      ['Ad Soyad', name.trim()],
      ['E-posta', email.trim()],
      ['Telefon', trimmedPhone || '—'],
      ['Dil', typeof locale === 'string' && locale ? locale : '—'],
      ['Tarih', timestamp],
    ]

    const html = `
      <h2 style="font-family: sans-serif;">Yeni iletişim formu mesajı</h2>
      <table style="font-family: sans-serif; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 4px 12px 4px 0; font-weight: bold; vertical-align: top;">${label}</td>
            <td style="padding: 4px 0;">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join('')}
      </table>
      <h3 style="font-family: sans-serif;">Mesaj</h3>
      <p style="font-family: sans-serif; white-space: pre-wrap;">${escapeHtml(message.trim())}</p>
    `

    const text = [
      'Yeni iletişim formu mesajı',
      '',
      ...rows.map(([label, value]) => `${label}: ${value}`),
      '',
      'Mesaj:',
      message.trim(),
    ].join('\n')

    const { error } = await resend.emails.send({
      from: 'Yaz Evi <contact@yaz-evi.com>',
      to: ['info@yaz-evi.com'],
      replyTo: email.trim(),
      subject: `Yeni iletişim formu mesajı — ${name.trim()}`,
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(502).json({ message: 'Failed to send message' })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
