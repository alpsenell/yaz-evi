# Booking conversion, WhatsApp, social meta, image perf & analytics — design

Date: 2026-06-30 · Branch: `feat/booking-conversion`

## Goal
Recover lost booking conversions and improve discoverability/perf for the Yaz Evi
(yaz-evi.com) boutique-hotel site. Five features:

1. Request-to-book email (serverless via Resend)
2. WhatsApp booking channel
3. Per-route social/crawler meta (build-time)
4. Image performance
5. Testerify event tracking

## Decisions (from brainstorm)
- WhatsApp number: **0532 431 67 34** → `https://wa.me/905324316734`
- Email: **serverless via Resend**, `to: info@yaz-evi.com`, `from: bookings@yaz-evi.com`
  (both env-overridable), `reply-to: <guest email>`
- CDN resize: **unknown** → ship non-resize perf wins now; resizing behind a
  `VITE_CDN_RESIZE` flag (off by default) for later.
- Request-to-book form: **repurpose the Checkout page**.
- Tests: **vitest** for pure helpers.

## Feature 1 — Request-to-book email
- New `api/booking/request.ts` (Vercel fn): validates payload (mirrors
  `api/payment/initialize.ts`), re-reads room name + price from Firestore for an
  indicative total, sends via Resend. Honeypot field for bot defense.
- Env: `RESEND_API_KEY` (required), `BOOKING_FROM_EMAIL` (default
  `bookings@yaz-evi.com`), `BOOKING_TO_EMAIL` (default `info@yaz-evi.com`).
- Dep: `resend`.
- `Checkout.vue`: keep iyzico branch behind `paymentEnabled`; the `else` branch now
  POSTs to `/api/booking/request` and shows a success state instead of redirecting
  to `/contact`. The visible CTA becomes a real submit.
- User prerequisite: add `RESEND_API_KEY` in Vercel + verify domain in Resend.

## Feature 2 — WhatsApp
- New `src/utils/whatsapp.ts`: `buildWhatsAppUrl(text)`,
  `buildBookingWhatsAppText(state, locale)`. Number from a single constant.
- New `src/components/organisms/WhatsAppButton.vue`: floating, site-wide (in
  `App.vue`), aria-label, new tab, offset above the mobile sticky CTA.
- Contextual prefilled links on Booking step 3 + Checkout.
- Add `whatsapp` icon to `YazIcon.vue`.

## Feature 3 — Per-route social/crawler meta
- New `scripts/prerender-meta.mts`, run as `vite build && tsx scripts/prerender-meta.mts`.
- Imports `src/languages/tr.ts` (`seo[key]`) + `ROOMS`. For each public route writes
  `dist/<route>/index.html` with route-specific title/description/canonical/OG/Twitter.
- Public routes: `/`, `/about`, `/gallery`, `/rooms`, `/room/{5 slugs}`, `/booking`,
  `/experiences`, `/contact`, legal pages. Excluded: `/checkout`, `/booking/confirmation/*`.
- Vercel serves static files before the SPA rewrite. `SeoHead.vue` still handles
  client nav + language. Dep: `tsx` (dev).
- Rejected `vite-ssg` (render-time `window` access would break SSR).

## Feature 4 — Image perf
- `getMediaUrl(path, opts?)` + `getMediaSrcset()` with resizing behind
  `VITE_CDN_RESIZE` (off by default; current behavior unchanged).
- No-CDN wins now: `fetchpriority="high"` + preload LCP hero; `width`/`height` (or
  aspect-ratio) to prevent CLS; `decoding="async"`; lazy-load audit. Apply to Home,
  Rooms, Room, Gallery, Booking.

## Feature 5 — Analytics
- New `src/utils/analytics.ts`: `trackEvent(name)` → guarded
  `window.testerify?.customEvent?.(name)`.
- Events: `room_selected`, `booking_dates_selected`, `booking_proceed_to_checkout`,
  `booking_request_submitted`, `booking_request_failed`, `whatsapp_float_clicked`,
  `whatsapp_booking_clicked`, `contact_form_submitted`, `language_changed`,
  `book_now_clicked`.

## Cross-cutting
- i18n: new tr/en strings (request success/error, WhatsApp labels/messages).
- Tests: vitest for `whatsapp.ts`, `media.ts`, route-meta map.
- README: correct claims (payment still off; document request-to-book + WhatsApp).

## Verification
- `npm run build` succeeds; prerender writes per-route `dist/**/index.html`.
- `npm run test` (vitest) green for pure helpers.
- Manual: Checkout submit → email arrives; WhatsApp links prefill; view-source of a
  prerendered route shows route-specific OG tags.
