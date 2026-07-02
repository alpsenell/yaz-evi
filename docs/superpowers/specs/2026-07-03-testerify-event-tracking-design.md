# Testerify Event Tracking — Design

**Date:** 2026-07-03
**Goal:** Track every important interactive element on yaz-evi.com via `testerify.customEvent('<name>')` with descriptive, unique event names.

## Context

- `index.html` already loads `https://panel.testerify.com/testerify.js` with `defer`, exposing a global `testerify` object at runtime. Nothing calls it yet.
- Stack: Vue 3 + `<script setup>` + TypeScript + Vite SPA.
- Scope decision: **full coverage** — all nav/menu/footer links, every CTA, booking funnel steps, contact actions, gallery interactions, language switch. Trivial interactions (modal close buttons, overlay clicks, dropdown open/close toggles) are skipped.
- Naming decision: **camelCase, action-first** (`clickOnHeaderNavRooms` style).
- Wiring decision: **directive + util hybrid**.

## Architecture

Two new files plus one registration line:

### `src/utils/analytics.ts`

```ts
declare global {
  interface Window {
    testerify?: { customEvent: (name: string) => void }
  }
}

export const trackEvent = (name: string) => {
  try {
    window.testerify?.customEvent(name)
  } catch {
    // Analytics must never break the UI.
  }
}
```

- Silent no-op when the deferred script hasn't loaded yet or an ad-blocker removed it.
- Owns the `window.testerify` type declaration.

### `src/directives/track.ts`

A `v-track="'eventName'"` click directive modeled on the existing `src/directives/clickOutside.ts`:

- `beforeMount`: attach a click listener that calls `trackEvent(binding.value)`.
- `updated`: keep the tracked name current when the bound value is dynamic.
- `unmounted`: remove the listener.
- Registered in `src/main.ts` as `.directive('track', track)`, next to `click-outside`.

Works on plain elements, `<a>`, `<router-link>`, and component roots (e.g. `YazButton`, whose root renders as `button`/`a`/`router-link`).

### When to use which

- `v-track` for anything that is a plain click in a template.
- Direct `trackEvent()` calls only where a click is not the true signal: date range completed, form submitted, language actually changed, room selected programmatically.

## Naming rules

- camelCase, action-first: `clickOn…`, `select…`, `submit…`, `switch…`.
- Dynamic segments come from stable identifiers (`room.slug` in PascalCase, numeric indices) — **never** from translated labels, so names are language-independent.
- Every distinct element gets a distinct name; shared components receive a context prop to disambiguate placement.

## Event catalog

`{Room}` ∈ Zeus, Hera, Tenedos, Tenes, Ilyada (PascalCased `room.slug`).

### Global chrome

| Element | Event | Wiring |
|---|---|---|
| Header hamburger | `clickOnHeaderMenuToggle` | `v-track` |
| Header logo link | `clickOnHeaderLogo` | `v-track` |
| Drawer logo link | `clickOnMenuLogo` | `v-track` |
| Drawer nav links | `clickOnMenuAbout`, `clickOnMenuRooms`, `clickOnMenuGallery`, `clickOnMenuExperiences`, `clickOnMenuContact` | `v-track` with name derived from `item.url` |
| Language switch | `switchLanguageToEn`, `switchLanguageToTr` | `trackEvent()` in `LanguageSelector.selectLanguage`, only when the language actually changes |
| Drawer contact infos | `clickOnMenuPhone`, `clickOnMenuEmail`, `clickOnMenuAddress` | `v-track` via `ContactInfos` `trackContext` prop |
| Footer contact | `clickOnFooterPhone`, `clickOnFooterEmail`, `clickOnFooterAddress`, `clickOnFooterInstagram` | `v-track` |
| Footer legal links | `clickOnFooterBookingTerms`, `clickOnFooterPrivacyPolicy`, `clickOnFooterDeliveryAndReturn`, `clickOnFooterDistanceSales` | `v-track` |

### Home

| Element | Event | Wiring |
|---|---|---|
| TextAndButton CTA (→ /booking) | `clickOnHomeBookNow` | new optional `trackName` prop on `TextAndButton`, forwarded to `v-track` on its `YazButton` |

### Rooms list (`/rooms`, via `SliderHero`)

| Element | Event | Wiring |
|---|---|---|
| Details button | `clickOnRoomsDetails{Room}` | `v-track` (dynamic, from `roomSlug` prop) |
| Reserve button | `clickOnRoomsReserve{Room}` | `v-track` |
| Slider arrows | `clickOnRoomsSliderPrev{Room}`, `clickOnRoomsSliderNext{Room}` | `v-track` |

`SliderHero` derives the PascalCase room name from its `roomSlug` prop.

### Room detail (`/room/:slug`)

| Element | Event | Wiring |
|---|---|---|
| Info-bar book button | `clickOnRoomInfoBarBook{Room}` | `v-track` |
| Bottom CTA book button | `clickOnRoomCtaBook{Room}` | `v-track` |
| Hero slide (opens lightbox) | `clickOnRoomHeroImage{Room}` | `v-track` |
| Hero slider arrows | `clickOnRoomSliderPrev{Room}`, `clickOnRoomSliderNext{Room}` | `v-track` |
| Photo-grid image | `clickOnRoomGalleryImage{Room}` | `v-track` |
| Lightbox arrows | `clickOnRoomLightboxPrev{Room}`, `clickOnRoomLightboxNext{Room}` | `v-track` |
| Other-room card | `clickOnRoomOtherRoom{Room}` (target room) | `v-track` |
| Not-found back button | `clickOnRoomNotFoundBackToRooms` | `v-track` |

### Gallery (`/gallery`)

| Element | Event | Wiring |
|---|---|---|
| Grid image (opens modal) | `clickOnGalleryImage{N}` (1-based index) | `v-track` |
| Modal arrows | `clickOnGalleryModalPrev`, `clickOnGalleryModalNext` | `v-track` |

### Booking (`/booking`)

| Element | Event | Wiring |
|---|---|---|
| Room card select | `selectBookingRoom{Room}` | `trackEvent()` in `selectRoom()` (also covers keyboard select) |
| Date range completed | `selectBookingDates` | `trackEvent()` in `handleDateChange()` when both dates set |
| Guest stepper | `clickOnBookingGuestPlus`, `clickOnBookingGuestMinus` | `v-track` |
| Change room (step 2 bar) | `clickOnBookingDatesChangeRoom` | `v-track` |
| Change room (step 3 summary) | `clickOnBookingSummaryChangeRoom` | `v-track` |
| Change dates (step 3) | `clickOnBookingChangeDates` | `v-track` |
| Get-in-touch link (step 3) | `clickOnBookingSummaryGetInTouch` | `v-track` |
| Instagram note link | `clickOnBookingInstagram` | `v-track` |
| Book now (desktop + mobile sticky) | `clickOnBookingBookNow` | `trackEvent()` in `goToCheckout()` — one logical action for both buttons |

### Checkout (`/checkout`)

| Element | Event | Wiring |
|---|---|---|
| Contact-note phone link | `clickOnCheckoutPhone` | `v-track` |
| Contact-note Instagram link | `clickOnCheckoutInstagram` | `v-track` |
| Terms link | `clickOnCheckoutTermsLink` | `v-track` |
| Main CTA (get in touch) | `clickOnCheckoutGetInTouch` | `v-track` |
| Summary sidebar get-in-touch | `clickOnCheckoutSummaryGetInTouch` | `v-track` |
| Form submit | `submitCheckoutForm` | `trackEvent()` in `handleSubmit()` — future-proofs payment re-enable |

### Contact (`/contact`)

| Element | Event | Wiring |
|---|---|---|
| Form submit | `submitContactForm` | `trackEvent()` at top of `sendEmail()` |
| Submit outcome | `submitContactFormSuccess`, `submitContactFormError` | `trackEvent()` in success/error branches |
| Contact infos | `clickOnContactPagePhone`, `clickOnContactPageEmail`, `clickOnContactPageAddress` | `v-track` via `ContactInfos` `trackContext` prop |

## Shared-component changes

- **`ContactInfos.vue`**: new required `trackContext: string` prop (`'Menu'` from the drawer, `'ContactPage'` from Contact); links use `` v-track="`clickOn${trackContext}Phone`" `` etc.
- **`TextAndButton.vue`**: new optional `trackName?: string` prop; when set, applied as `v-track` on the inner `YazButton`.

## Deliberately out of scope

- Modal/drawer close buttons, overlay clicks, dropdown open/close toggles (trivial per scope decision).
- Google Maps iframe in the footer (cross-origin, untrackable).
- `BookingCard.vue`, `RoomGuestSelector.vue`, `organisms/DatePicker.vue` — imported nowhere (dead code); no tracking added.

## Error handling

- `trackEvent` never throws: optional chaining + try/catch.
- No queueing/retry: events fired before testerify loads are intentionally dropped — acceptable for this site's traffic and avoids complexity.

## Verification

No test infrastructure exists in this repo. Verification is:

1. `npm run build` (catches TS/template errors).
2. Dev-server smoke test: stub `window.testerify = { customEvent: (n) => console.log('[tfy]', n) }` in the console, then click through nav, booking funnel, gallery, and forms confirming expected names fire exactly once per interaction.
