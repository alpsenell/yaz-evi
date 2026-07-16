# Testerify Event Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fire `testerify.customEvent('<name>')` for every important interactive element on yaz-evi.com, with descriptive, unique, camelCase event names.

**Architecture:** A safe `trackEvent()` util (`src/utils/analytics.ts`) that no-ops when the deferred testerify script is absent, plus a global `v-track` click directive (`src/directives/track.ts`) for template cases. Direct `trackEvent()` calls only where a click is not the true signal (date range completed, form submitted, language changed, room selected).

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + Vite. The testerify script is already loaded in `index.html` (`https://panel.testerify.com/testerify.js`, `defer`) — no new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-03-testerify-event-tracking-design.md` (approved). The full event catalog lives there; every name below is copied from it.

## Global Constraints

- Event names: camelCase, action-first (`clickOn…`, `select…`, `submit…`, `switch…`).
- Dynamic name segments come from `room.slug` (capitalized) or numeric indices — NEVER from translated labels.
- `trackEvent` must never throw or block the UI (optional chaining + try/catch, no queueing).
- No behavioral or visual changes to any component — tracking only.
- **No test framework exists in this repo and none is to be added.** Per the spec's Verification section, each task's gate is `npm run build` passing; the final task is a dev-server smoke test. TDD steps are replaced by build-verify steps.
- Do not touch dead components: `BookingCard.vue`, `RoomGuestSelector.vue`, `organisms/DatePicker.vue`.
- Every commit will trigger the repo's pre-commit security-review gate; follow the hook's flow when it fires.
- Commit messages: descriptive imperative sentence, matching existing history style.

---

### Task 1: Analytics util + v-track directive + registration

**Files:**
- Create: `src/utils/analytics.ts`
- Create: `src/directives/track.ts`
- Modify: `src/main.ts` (imports block and app chain, lines 1–16)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `trackEvent(name: string): void` — exported from `src/utils/analytics.ts`; all later tasks import it.
  - `capitalize(value: string): string` — exported from `src/utils/analytics.ts`; used for slug → PascalCase name segments.
  - Global template directive `v-track="<string>"` — attaches a click listener that calls `trackEvent` with the bound string; safe when the bound value is `undefined`.

- [ ] **Step 1: Create `src/utils/analytics.ts`**

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

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)
```

- [ ] **Step 2: Create `src/directives/track.ts`** (modeled on `src/directives/clickOutside.ts`)

```ts
import { Directive } from "vue";
import { trackEvent } from "../utils/analytics";

interface TrackElement extends HTMLElement {
  __trackName?: string;
  __trackHandler?: () => void;
}

const track: Directive<TrackElement, string | undefined> = {
  beforeMount(el, binding) {
    el.__trackName = binding.value;
    el.__trackHandler = () => {
      if (el.__trackName) {
        trackEvent(el.__trackName);
      }
    };
    el.addEventListener("click", el.__trackHandler);
  },
  updated(el, binding) {
    el.__trackName = binding.value;
  },
  unmounted(el) {
    if (el.__trackHandler) {
      el.removeEventListener("click", el.__trackHandler);
    }
  },
};

export default track;
```

- [ ] **Step 3: Register the directive in `src/main.ts`**

Add the import below the `clickOutside` import:

```ts
import track from './directives/track.ts';
```

Add the directive to the app chain, directly after `.directive('click-outside', clickOutside)`:

```ts
  .directive('track', track)
```

Resulting chain:

```ts
const app = i18n(createApp(App))
  .directive('click-outside', clickOutside)
  .directive('track', track)
  .use(VueSplide)
  .use(setupCalendar)
  .use(router)
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exits 0, `dist/` produced, no TS/template errors.

- [ ] **Step 5: Commit** (include the plan document so it's tracked)

```bash
git add src/utils/analytics.ts src/directives/track.ts src/main.ts docs/superpowers/plans/2026-07-03-testerify-event-tracking.md
git commit -m "Add testerify trackEvent util and global v-track directive"
```

---

### Task 2: Global chrome — Header, MenuDrawer, LanguageSelector, ContactInfos, Footer

**Files:**
- Modify: `src/components/Header.vue` (template)
- Modify: `src/components/organisms/MenuDrawer.vue` (script + template)
- Modify: `src/components/organisms/LanguageSelector.vue` (script)
- Modify: `src/components/organisms/ContactInfos.vue` (script + template)
- Modify: `src/components/pages/Contact.vue` (template — ONLY the `<ContactInfos />` usage; the rest of Contact.vue is Task 5)
- Modify: `src/components/Footer.vue` (template)

**Interfaces:**
- Consumes: `v-track` directive, `trackEvent`, `capitalize` from Task 1.
- Produces: `ContactInfos` gains a required prop `trackContext: string`; callers pass `track-context="Menu"` (drawer) and `track-context="ContactPage"` (contact page). Events emitted: `clickOn${trackContext}Phone`, `clickOn${trackContext}Email`, `clickOn${trackContext}Address`.

- [ ] **Step 1: `Header.vue` — hamburger + logo**

On the hamburger `<button>` (the one with `@click="emit('toggleMobileMenu')"`), add:

```
v-track="'clickOnHeaderMenuToggle'"
```

On the logo `<router-link to="/">`, add:

```
v-track="'clickOnHeaderLogo'"
```

- [ ] **Step 2: `MenuDrawer.vue` — logo + nav links**

In the script block, add below the existing imports:

```ts
import { capitalize } from "../../utils/analytics";
```

And below the `openPosition` computed:

```ts
const menuTrackName = (url: string) => `clickOnMenu${capitalize(url.replace('/', ''))}`;
```

(With `HEADER_MENU_ITEMS` urls `/about`, `/rooms`, `/gallery`, `/experiences`, `/contact` this yields `clickOnMenuAbout`, `clickOnMenuRooms`, `clickOnMenuGallery`, `clickOnMenuExperiences`, `clickOnMenuContact`.)

On the drawer logo `<router-link to="/">`, add:

```
v-track="'clickOnMenuLogo'"
```

On the nav `<router-link>` inside the `v-for="item in HEADER_MENU_ITEMS"` loop, add:

```
v-track="menuTrackName(item.url)"
```

On the `<ContactInfos />` usage, pass the context:

```html
<ContactInfos track-context="Menu" />
```

Do NOT add tracking to the drawer close button or overlay (trivial, out of scope).

- [ ] **Step 3: `LanguageSelector.vue` — track actual language switches**

Add the import:

```ts
import { trackEvent, capitalize } from "../../utils/analytics";
```

Replace `selectLanguage` with:

```ts
const selectLanguage = (language: string) => {
  if (language !== selectedLanguage.value) {
    trackEvent(`switchLanguageTo${capitalize(language)}`);
  }
  changeLanguage(language);
  selectedLanguage.value = language;
}
```

(Yields `switchLanguageToEn` / `switchLanguageToTr`; re-selecting the current language fires nothing.)

- [ ] **Step 4: `ContactInfos.vue` — add `trackContext` prop and track the three links**

Replace the script block content with:

```ts
import YazIcon from "../atoms/YazIcon.vue";

defineProps<{ trackContext: string }>();
```

On the phone `<a href="tel:+905324316734">`, add:

```
v-track="`clickOn${trackContext}Phone`"
```

On the mail `<a href="mailto:info@yaz-evi.com">`, add:

```
v-track="`clickOn${trackContext}Email`"
```

On the address `<a href="https://maps.app.goo.gl/ggPm96WbCZujmtQq5">`, add:

```
v-track="`clickOn${trackContext}Address`"
```

- [ ] **Step 5: `Contact.vue` — pass the context prop (one-line change only)**

```html
<ContactInfos track-context="ContactPage" />
```

- [ ] **Step 6: `Footer.vue` — contact, social, legal links**

Add `v-track` to each anchor/link:

| Element (existing) | Add |
|---|---|
| `<a href="tel:+905324316734">` | `v-track="'clickOnFooterPhone'"` |
| `<a href="mailto:info@yaz-evi.com">` | `v-track="'clickOnFooterEmail'"` |
| `<a href="https://goo.gl/maps/7Z3">` | `v-track="'clickOnFooterAddress'"` |
| `<a href="https://www.instagram.com/yazevibozcaada_/">` | `v-track="'clickOnFooterInstagram'"` |
| `<router-link to="/booking-terms">` | `v-track="'clickOnFooterBookingTerms'"` |
| `<router-link to="/privacy-policy">` | `v-track="'clickOnFooterPrivacyPolicy'"` |
| `<router-link to="/delivery-and-return">` | `v-track="'clickOnFooterDeliveryAndReturn'"` |
| `<router-link to="/distance-sales-agreement">` | `v-track="'clickOnFooterDistanceSales'"` |

The map iframe gets nothing (untrackable, out of scope).

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: exits 0. (A missing `trackContext` on any `ContactInfos` usage surfaces here as a type/template warning — there are exactly two usages, both updated above.)

- [ ] **Step 8: Commit**

```bash
git add src/components/Header.vue src/components/organisms/MenuDrawer.vue src/components/organisms/LanguageSelector.vue src/components/organisms/ContactInfos.vue src/components/pages/Contact.vue src/components/Footer.vue
git commit -m "Track header, menu drawer, language switch, contact links, and footer interactions"
```

---

### Task 3: Home CTA + Rooms list (TextAndButton, SliderHero)

**Files:**
- Modify: `src/components/organisms/TextAndButton.vue` (script + template)
- Modify: `src/components/pages/Home.vue` (template — TextAndButton usage)
- Modify: `src/components/organisms/SliderHero.vue` (script + template)

**Interfaces:**
- Consumes: `v-track`, `capitalize` from Task 1.
- Produces: `TextAndButton` gains optional prop `trackName?: string` forwarded as `v-track` to its inner `YazButton`. `SliderHero` computes `roomTrackName` (capitalized `roomSlug`) used in its four event names.

- [ ] **Step 1: `TextAndButton.vue` — optional `trackName` prop**

Replace the props line with:

```ts
defineProps({ buttonLabel: String, buttonUrl: String, trackName: String });
```

On the `<yaz-button>` in the template, add:

```
v-track="trackName"
```

(When `trackName` is unset the directive binds `undefined` and the handler no-ops — see Task 1.)

- [ ] **Step 2: `Home.vue` — name the CTA**

On the `<TextAndButton>` usage, add the attribute:

```
track-name="clickOnHomeBookNow"
```

- [ ] **Step 3: `SliderHero.vue` — details/reserve buttons + slider arrows**

Replace the script block content with:

```ts
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import { computed } from "vue";
import YazIcon from "../atoms/YazIcon.vue";
import YazButton from "../atoms/YazButton.vue";
import { getMediaUrl } from '../../utils/media';
import { capitalize } from '../../utils/analytics';

const props = defineProps({
  images: Array,
  size: String,
  imagePosition: String,
  title: String,
  description: String,
  roomSlug: String,
})

const roomTrackName = computed(() => capitalize(props.roomSlug ?? ''));
```

(Note: this drops the unnecessary `defineProps` import — it's a compiler macro — and captures props into a variable. No other behavior changes.)

Template additions:

| Element (existing) | Add |
|---|---|
| `<button class="splide__arrow splide__arrow--prev relative">` | ``v-track="`clickOnRoomsSliderPrev${roomTrackName}`"`` |
| `<button class="splide__arrow splide__arrow--next relative">` | ``v-track="`clickOnRoomsSliderNext${roomTrackName}`"`` |
| `<YazButton :label="$t('details')" … :href="`/room/${roomSlug}`" />` | ``v-track="`clickOnRoomsDetails${roomTrackName}`"`` |
| `<YazButton :label="$t('reserve')" … :href="`/booking?room=${roomSlug}`" />` | ``v-track="`clickOnRoomsReserve${roomTrackName}`"`` |

(With slugs zeus/hera/tenedos/tenes/ilyada this yields e.g. `clickOnRoomsReserveZeus`.)

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/organisms/TextAndButton.vue src/components/pages/Home.vue src/components/organisms/SliderHero.vue
git commit -m "Track home CTA and rooms list interactions"
```

---

### Task 4: Room detail + Gallery

**Files:**
- Modify: `src/components/pages/Room.vue` (script + template)
- Modify: `src/components/pages/Gallery.vue` (template)

**Interfaces:**
- Consumes: `v-track`, `capitalize` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: `Room.vue` script — trackable room name**

Add the import:

```ts
import { capitalize } from '../../utils/analytics'
```

Add below the `otherRooms` computed:

```ts
const roomTrackName = computed(() => room.value ? capitalize(room.value.slug) : '')
```

- [ ] **Step 2: `Room.vue` template — add `v-track` per element**

| Element (existing) | Add |
|---|---|
| Hero `<SplideSlide … @click="openLightbox(index)">` | ``v-track="`clickOnRoomHeroImage${roomTrackName}`"`` |
| Hero `<button class="splide__arrow splide__arrow--prev relative">` | ``v-track="`clickOnRoomSliderPrev${roomTrackName}`"`` |
| Hero `<button class="splide__arrow splide__arrow--next relative">` | ``v-track="`clickOnRoomSliderNext${roomTrackName}`"`` |
| Quick-info-bar `<YazButton :label="$t('roomDetail.bookThisRoom')" … class="hidden md:flex" />` | ``v-track="`clickOnRoomInfoBarBook${roomTrackName}`"`` |
| Photo-grid `<div … @click="openLightbox(index)">` (inside `v-for="(image, index) in room.images"`) | ``v-track="`clickOnRoomGalleryImage${roomTrackName}`"`` |
| Bottom CTA `<YazButton :label="$t('roomDetail.bookThisRoom')" … class="mx-auto w-fit" />` | ``v-track="`clickOnRoomCtaBook${roomTrackName}`"`` |
| Other-rooms `<router-link v-for="other in otherRooms" …>` | ``v-track="`clickOnRoomOtherRoom${capitalize(other.slug)}`"`` |
| Lightbox prev `<button … @click="prevImage">` | ``v-track="`clickOnRoomLightboxPrev${roomTrackName}`"`` |
| Lightbox next `<button … @click="nextImage">` | ``v-track="`clickOnRoomLightboxNext${roomTrackName}`"`` |
| Not-found `<YazButton label="Back to Rooms" type="primary" href="/rooms" />` | `v-track="'clickOnRoomNotFoundBackToRooms'"` |

The lightbox close button and `@click.self` backdrop get nothing (trivial, out of scope). `capitalize` is available in the template because `<script setup>` exposes imports.

- [ ] **Step 3: `Gallery.vue` template — grid images + modal arrows**

Both grid loops (the `md:` 4-column loop and the mobile 2-column loop) contain a clickable `<div … @click="handleClick(image)" role="button">`. On BOTH, add:

```
v-track="`clickOnGalleryImage${childIndex + 1}`"
```

(Desktop and mobile variants of the same image intentionally share one name — only one is rendered per viewport.)

On the modal arrows:

| Element (existing) | Add |
|---|---|
| `<button class="splide__arrow splide__arrow--prev …" :aria-label="$t('galleryModal.previousImage')">` | `v-track="'clickOnGalleryModalPrev'"` |
| `<button class="splide__arrow splide__arrow--next …" :aria-label="$t('galleryModal.nextImage')">` | `v-track="'clickOnGalleryModalNext'"` |

The `YazModal` close icon gets nothing (trivial, out of scope).

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/Room.vue src/components/pages/Gallery.vue
git commit -m "Track room detail and gallery interactions"
```

---

### Task 5: Booking funnel — Booking, Checkout, Contact form

**Files:**
- Modify: `src/components/pages/Booking.vue` (script + template)
- Modify: `src/components/pages/Checkout.vue` (script + template)
- Modify: `src/components/pages/Contact.vue` (script — the `ContactInfos` prop was already added in Task 2)

**Interfaces:**
- Consumes: `v-track`, `trackEvent`, `capitalize` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: `Booking.vue` script — programmatic funnel events**

Add the import:

```ts
import { trackEvent, capitalize } from "../../utils/analytics";
```

In `selectRoom`, add tracking after the same-room guard:

```ts
const selectRoom = (room: Room) => {
  if (selectedRoom.value?.id === room.id) return;
  trackEvent(`selectBookingRoom${capitalize(room.slug)}`);
  selectedRoom.value = room;
  selectedDates.value = { start: null, end: null };
  calendarKey.value++;
};
```

In `handleDateChange`, track completed ranges:

```ts
const handleDateChange = (dates: { start: Date | null; end: Date | null }) => {
  if (dates && dates.start && dates.end) {
    trackEvent('selectBookingDates');
    selectedDates.value = dates;
  }
};
```

In `goToCheckout`, add tracking after the guard (one logical event for both the desktop and mobile-sticky button):

```ts
const goToCheckout = () => {
  if (!selectedRoom.value || !selectedDates.value.start || !selectedDates.value.end) return;
  trackEvent('clickOnBookingBookNow');
  // …existing body unchanged…
```

- [ ] **Step 2: `Booking.vue` template — add `v-track` per element**

| Element (existing) | Add |
|---|---|
| Instagram note `<a href="https://www.instagram.com/yazevibozcaada_/" …>` | `v-track="'clickOnBookingInstagram'"` |
| Step-2 bar `<button @click="changeRoom" …>` | `v-track="'clickOnBookingDatesChangeRoom'"` |
| Guest minus `<button @click="guestNumber = Math.max(1, guestNumber - 1)" …>` | `v-track="'clickOnBookingGuestMinus'"` |
| Guest plus `<button @click="guestNumber = Math.min(…)" …>` | `v-track="'clickOnBookingGuestPlus'"` |
| Step-3 `<button @click="changeRoom" … class="… shrink-0">` | `v-track="'clickOnBookingSummaryChangeRoom'"` |
| Step-3 `<button @click="selectedDates = { start: null, end: null }" …>` | `v-track="'clickOnBookingChangeDates'"` |
| Step-3 `<router-link to="/contact" …>` (get in touch) | `v-track="'clickOnBookingSummaryGetInTouch'"` |

Room cards are NOT template-tracked — `selectRoom()` covers click and keyboard selection in one place. The two Book-now `YazButton`s are covered by `goToCheckout()`.

- [ ] **Step 3: `Checkout.vue` script — form submit event**

Add the import:

```ts
import { trackEvent } from '../../utils/analytics'
```

At the top of `handleSubmit`:

```ts
const handleSubmit = async () => {
  trackEvent('submitCheckoutForm')
  if (!paymentEnabled) {
    router.push('/contact')
    return
  }
  // …existing body unchanged…
```

- [ ] **Step 4: `Checkout.vue` template — add `v-track` per element**

| Element (existing) | Add |
|---|---|
| Contact-note `<a href="tel:+905324316734" …>` | `v-track="'clickOnCheckoutPhone'"` |
| Contact-note `<a href="https://www.instagram.com/yazevibozcaada_/" …>` | `v-track="'clickOnCheckoutInstagram'"` |
| Terms `<a href="/booking-terms" target="_blank" …>` | `v-track="'clickOnCheckoutTermsLink'"` |
| Main CTA `<YazButton :label="$t('getInTouch')" type="primary" href="/contact" class="w-fit" />` | `v-track="'clickOnCheckoutGetInTouch'"` |
| Sidebar `<router-link to="/contact" …>` (get in touch) | `v-track="'clickOnCheckoutSummaryGetInTouch'"` |

- [ ] **Step 5: `Contact.vue` script — form submit + outcome events**

Add the import:

```ts
import { trackEvent } from '../../utils/analytics';
```

In `sendEmail`, add three calls:

```ts
const sendEmail = async () => {
  trackEvent('submitContactForm');
  isSubmitting.value = true;
  submitSuccess.value = false;
  submitError.value = false;

  try {
    // …existing emailjs.send call unchanged…

    if (result.status === 200) {
      trackEvent('submitContactFormSuccess');
      submitSuccess.value = true;
      formData.value = { name: '', email: '', subject: '', message: '' };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    trackEvent('submitContactFormError');
    submitError.value = true;
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Email sending failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/components/pages/Booking.vue src/components/pages/Checkout.vue src/components/pages/Contact.vue
git commit -m "Track booking funnel, checkout, and contact form interactions"
```

---

### Task 6: End-to-end smoke test

**Files:**
- No file changes. Verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–5.
- Produces: verified confirmation that events fire with the expected names.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev` (background)
Expected: Vite serves on the printed localhost URL.

- [ ] **Step 3: Stub testerify and click through**

In the browser console on the dev URL, install a stub BEFORE interacting:

```js
window.testerify = { customEvent: (n) => console.log('[tfy]', n) };
```

Then verify at minimum these interactions log exactly one event each, with exactly these names:

1. Hamburger → `clickOnHeaderMenuToggle`; drawer "Rooms" link → `clickOnMenuRooms`.
2. Language dropdown → switch to the other language → `switchLanguageToEn` or `switchLanguageToTr` (and nothing when re-selecting the current one).
3. Footer Instagram → `clickOnFooterInstagram`.
4. Home CTA → `clickOnHomeBookNow`.
5. `/rooms`: Zeus reserve button → `clickOnRoomsReserveZeus`.
6. `/room/zeus`: info-bar book → `clickOnRoomInfoBarBookZeus`; a grid photo → `clickOnRoomGalleryImageZeus`.
7. `/gallery`: third image → `clickOnGalleryImage3`; modal next arrow → `clickOnGalleryModalNext`.
8. `/booking`: pick Hera → `selectBookingRoomHera` (no space, capitalized slug); complete a date range → `selectBookingDates`; guest plus → `clickOnBookingGuestPlus`; Book now → `clickOnBookingBookNow`.
9. `/checkout` (after step 8): main CTA → `clickOnCheckoutGetInTouch`.
10. `/contact`: submit the form (any values) → `submitContactForm` followed by `submitContactFormSuccess` or `submitContactFormError`.

- [ ] **Step 4: Report results**

Report each checked interaction and its logged event name. Any mismatch or double-fire is a defect to fix before declaring the plan done.
