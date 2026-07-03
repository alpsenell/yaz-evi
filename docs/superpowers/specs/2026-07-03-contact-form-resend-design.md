# Contact Form — Resend Migration & Validation Design

**Date:** 2026-07-03
**Status:** Approved

## Goal

Replace the client-side EmailJS contact form with a server-side Resend integration, add proper input validation, remove the subject field, and add an optional Turkish phone number field with masking.

## Context

- `src/components/pages/Contact.vue` currently sends email client-side via `@emailjs/browser` (the only consumer of that package).
- The repo already has Vercel serverless functions under `api/` (`@vercel/node`).
- `src/components/pages/Checkout.vue` already implements TR phone masking (`+90 (5XX) XXX XX XX`), email/phone regex validation, and a `touched`/`submitAttempted` error-display pattern.
- `validation.*` i18n keys already exist in `src/languages/en.ts` and `tr.ts`.
- Resend account exists with `yaz-evi.com` domain verified; `RESEND_API_KEY` will be set on Vercel.

## Design

### API route — `api/contact.ts`

- POST only; 405 otherwise.
- Request body: `{ name, email, phone?, message, locale?, website? }` (`website` is the honeypot field).
- Server-side validation (mirrors client):
  - `name`: required, trimmed non-empty, max 100 chars.
  - `email`: required, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, max 200 chars.
  - `message`: required, trimmed non-empty, max 5000 chars.
  - `phone`: optional; if provided must match `/^\+90 \(5\d{2}\) \d{3} \d{2} \d{2}$/`.
  - Invalid → 400 with `{ message }`.
- Honeypot: if `website` is non-empty, return 200 `{ ok: true }` without sending (silent drop).
- Send via official `resend` SDK:
  - `from: 'Yaz Evi <contact@yaz-evi.com>'`
  - `to: 'info@yaz-evi.com'`
  - `replyTo`: submitter's email
  - Subject: `Yeni iletişim formu mesajı — {name}`
  - Structured HTML body with labeled rows (Ad Soyad, E-posta, Telefon, Mesaj, locale, timestamp) plus plain-text fallback.
- Success → 200 `{ ok: true }`; Resend failure → 502 with generic message (log details server-side).
- Env: `RESEND_API_KEY` (server-side only, no `VITE_` prefix).

### Shared validation util — `src/utils/validation.ts`

Extract from Checkout.vue so Contact and Checkout share one source:

- `emailRegex`
- `turkishPhoneRegex`
- `formatTurkishPhone(raw: string): string` — the digit-mask logic currently inline in `handlePhoneInput`.

Checkout.vue switches to importing these; no behavior change there.

### Frontend — `Contact.vue`

- Remove subject input and all EmailJS code.
- Fields: name (required), email (required + regex), phone (optional, TR mask), message (required).
- Phone input uses `formatTurkishPhone` on input, same UX as Checkout. Label carries an "(optional)" hint. Empty = valid; non-empty must match `turkishPhoneRegex`.
- Validation UX copied from Checkout: `touched` per field + `submitAttempted`, error text under each field, submit blocked while invalid.
- Honeypot: hidden `website` text input (visually hidden, `autocomplete="off"`, `tabindex="-1"`), sent with the payload.
- Submit: `fetch('/api/contact', { method: 'POST', ... })` with JSON body including current locale. Keep existing success/error message display and analytics events (`submitContactForm`, `submitContactFormSuccess`, `submitContactFormError`).

### i18n — `en.ts` / `tr.ts`

- Remove `pages.contact.subject`.
- Add `pages.contact.phone` (label) and `pages.contact.phoneOptional` (hint), e.g. EN "Phone", "(optional)" / TR "Telefon", "(isteğe bağlı)".
- Add `validation.messageRequired` (EN: "Message is required." / TR: "Mesaj alanı zorunludur.").
- Reuse existing `validation.emailRequired/emailInvalid/nameRequired/phoneInvalid`.

### Dependency changes

- Add: `resend`.
- Remove: `@emailjs/browser`.
- `VITE_EMAILJS_*` env vars become dead — remove from Vercel project settings (manual step for owner).

## Error handling

- Client: field-level messages before submit; on API failure show existing generic `errorMessage` translation.
- Server: 400 for validation, 405 for method, 502 for Resend failure, 500 catch-all; details logged via `console.error` (visible in Vercel logs).

## Testing

No automated test infrastructure exists in this repo. Verification is manual:

- `npm run build` passes.
- Browser: validation states (empty fields, bad email, partial phone), phone mask behavior, successful submit against deployed/preview API.
- Confirm structured email arrives at info@yaz-evi.com with working Reply-To.

## Out of scope

- International (non-TR) phone formats — field is optional; foreign guests skip it.
- Rate limiting / CAPTCHA — honeypot only for now.
