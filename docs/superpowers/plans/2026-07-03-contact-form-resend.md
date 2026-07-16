# Contact Form Resend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client-side EmailJS contact form with a server-side Resend integration, add field validation, remove the subject field, and add an optional TR-masked phone field.

**Architecture:** A new Vercel serverless function `api/contact.ts` validates input and sends structured email via the `resend` SDK (key stays server-side). `Contact.vue` gains Checkout-style validation UX and posts to the API. Shared regexes and the phone mask move to `src/utils/validation.ts`, consumed by both Contact and Checkout.

**Tech Stack:** Vue 3 `<script setup lang="ts">`, Vite, Tailwind, i18next, Vercel serverless (`@vercel/node`), Resend.

**Spec:** `docs/superpowers/specs/2026-07-03-contact-form-resend-design.md`

## Global Constraints

- Node is installed via nvm and NOT on PATH. Before any npm command: `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"`
- No automated test infrastructure exists in this repo; do NOT add one. Verification = `npm run build` + IDE TypeScript diagnostics + manual browser checks. `npm run build` does not type-check and does not compile `api/` — check `api/contact.ts` with IDE diagnostics.
- Email sender: `Yaz Evi <contact@yaz-evi.com>`; recipient: `info@yaz-evi.com`; subject: `Yeni iletişim formu mesajı — {name}`.
- Phone format everywhere: `+90 (5XX) XXX XX XX`, regex `/^\+90 \(5\d{2}\) \d{3} \d{2} \d{2}$/`.
- Env var `RESEND_API_KEY` (no `VITE_` prefix) — set on Vercel by the owner; not available locally (repo has no real `.env`).
- Keep existing analytics events untouched: `submitContactForm`, `submitContactFormSuccess`, `submitContactFormError`.
- Commit messages end with the Co-Authored-By / Claude-Session trailer used in this session.

---

### Task 1: Shared validation util + Checkout refactor

**Files:**
- Create: `src/utils/validation.ts`
- Modify: `src/components/pages/Checkout.vue:80-142` (regex definitions and `handlePhoneInput`)

**Interfaces:**
- Produces: `emailRegex: RegExp`, `turkishPhoneRegex: RegExp`, `formatTurkishPhone(raw: string): string` — exported from `src/utils/validation.ts`. Task 4 imports all three.

- [ ] **Step 1: Create `src/utils/validation.ts`**

```ts
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
```

- [ ] **Step 2: Refactor Checkout.vue to use the util**

In `src/components/pages/Checkout.vue`, add to the imports block (after the `trackEvent` import on line 14):

```ts
import { emailRegex, turkishPhoneRegex, formatTurkishPhone } from '../../utils/validation'
```

Replace lines 80–82:

```ts
// Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const turkishPhoneRegex = /^\+90 \(5\d{2}\) \d{3} \d{2} \d{2}$/
```

with:

```ts
// Validation
```

Replace the body of `handlePhoneInput` (lines 107–142) with:

```ts
// Phone masking
const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const formatted = formatTurkishPhone(input.value)

  guestInfo.value.phone = formatted
  nextTick(() => {
    input.value = formatted
  })
}
```

- [ ] **Step 3: Verify build passes**

Run: `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH" && npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/validation.ts src/components/pages/Checkout.vue
git commit -m "Extract shared email/phone validation and TR phone mask util"
```

---

### Task 2: Resend API route

**Files:**
- Modify: `package.json` (add `resend` dependency)
- Create: `api/contact.ts`

**Interfaces:**
- Consumes: nothing from other tasks (regexes duplicated server-side deliberately — `api/` is a separate compilation context from `src/`, and server must not trust the client anyway).
- Produces: `POST /api/contact` accepting JSON `{ name: string, email: string, phone?: string, message: string, locale?: string, website?: string }`. Responses: 200 `{ ok: true }`, 400/405/500/502 `{ message: string }`. Task 4's fetch call relies on this contract.

- [ ] **Step 1: Install resend**

Run: `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH" && npm install resend`
Expected: added to `dependencies` in package.json, lockfile updated.

- [ ] **Step 2: Create `api/contact.ts`**

```ts
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
```

- [ ] **Step 3: Verify TypeScript diagnostics are clean**

Check IDE/TypeScript diagnostics for `api/contact.ts` (e.g. `mcp__ide__getDiagnostics`). If the installed `resend` version rejects `replyTo`, use `reply_to` instead (older SDK naming) — check `node_modules/resend` types.
Expected: no errors in `api/contact.ts`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json api/contact.ts
git commit -m "Add /api/contact serverless route sending via Resend"
```

---

### Task 3: i18n — add new keys (both languages)

**Files:**
- Modify: `src/languages/en.ts` (`pages.contact` block ~line 79; `validation` block ~line 214)
- Modify: `src/languages/tr.ts` (`pages.contact` block ~line 79; `validation` block ~line 214)

**Interfaces:**
- Produces: i18n keys `pages.contact.phone`, `pages.contact.phoneOptional`, `validation.messageRequired`. Task 4's template uses them. (`pages.contact.subject` is removed in Task 4, together with the component that still references it.)

- [ ] **Step 1: en.ts — add contact keys**

In the `pages.contact` block, after the `email: "Email",` line add:

```ts
      phone: "Phone",
      phoneOptional: "(optional)",
```

In the `validation` block, after `emailInvalid: 'Please enter a valid email address.',` add:

```ts
    messageRequired: 'Message is required.',
```

- [ ] **Step 2: tr.ts — add contact keys**

In the `pages.contact` block, after the `email: "E-posta",` line add:

```ts
      phone: "Telefon",
      phoneOptional: "(isteğe bağlı)",
```

In the `validation` block, after `emailInvalid: 'Lütfen geçerli bir e-posta adresi girin.',` add:

```ts
    messageRequired: 'Mesaj alanı zorunludur.',
```

- [ ] **Step 3: Verify build passes**

Run: `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH" && npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/languages/en.ts src/languages/tr.ts
git commit -m "Add contact form phone and message-required translations"
```

---

### Task 4: Rewrite Contact.vue

**Files:**
- Modify: `src/components/pages/Contact.vue` (full rewrite of script + form portion of template)
- Modify: `src/languages/en.ts`, `src/languages/tr.ts` (remove now-unused `subject` key)

**Interfaces:**
- Consumes: `emailRegex`, `turkishPhoneRegex`, `formatTurkishPhone` from `src/utils/validation` (Task 1); `POST /api/contact` contract (Task 2); i18n keys (Task 3).

- [ ] **Step 1: Replace the `<script setup>` block of `src/components/pages/Contact.vue`**

```vue
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import i18next from 'i18next';
import { useTranslation } from 'i18next-vue';
import HalfHero from "../organisms/HalfHero.vue";
import YazButton from "../atoms/YazButton.vue";
import ContactInfos from "../organisms/ContactInfos.vue";
import { trackEvent } from '../../utils/analytics';
import { emailRegex, turkishPhoneRegex, formatTurkishPhone } from '../../utils/validation';

const { t } = useTranslation();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
  website: '', // honeypot — real users never see or fill this
});

const touched = ref({
  name: false,
  email: false,
  phone: false,
  message: false,
});

const submitAttempted = ref(false);
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);

const isPhoneEmpty = computed(() => {
  const trimmed = formData.value.phone.trim();
  return trimmed === '' || trimmed === '+90';
});

const errors = computed(() => ({
  name: formData.value.name.trim() === '' ? t('validation.nameRequired') : '',
  email: formData.value.email.trim() === ''
    ? t('validation.emailRequired')
    : !emailRegex.test(formData.value.email.trim())
      ? t('validation.emailInvalid')
      : '',
  phone: !isPhoneEmpty.value && !turkishPhoneRegex.test(formData.value.phone.trim())
    ? t('validation.phoneInvalid')
    : '',
  message: formData.value.message.trim() === '' ? t('validation.messageRequired') : '',
}));

const isFormValid = computed(() => Object.values(errors.value).every(e => e === ''));

const shouldShowError = (field: keyof typeof touched.value) => {
  return (touched.value[field] || submitAttempted.value) && errors.value[field];
};

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formatted = formatTurkishPhone(input.value);
  formData.value.phone = formatted;
  nextTick(() => {
    input.value = formatted;
  });
};

const sendEmail = async () => {
  trackEvent('submitContactForm');
  submitAttempted.value = true;
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitSuccess.value = false;
  submitError.value = false;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.value.name.trim(),
        email: formData.value.email.trim(),
        phone: isPhoneEmpty.value ? '' : formData.value.phone.trim(),
        message: formData.value.message.trim(),
        locale: i18next.language,
        website: formData.value.website,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    trackEvent('submitContactFormSuccess');
    submitSuccess.value = true;
    formData.value = { name: '', email: '', phone: '', message: '', website: '' };
    touched.value = { name: false, email: false, phone: false, message: false };
    submitAttempted.value = false;
  } catch (error) {
    trackEvent('submitContactFormError');
    submitError.value = true;
    console.error('Contact form submission failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
```

Notes vs. old code: EmailJS import/call gone, `subject` gone, `errorMessage` detail ref gone (generic translated error only), `YazIcon` import dropped (unused in this component's template).

- [ ] **Step 2: Replace the template's error block and `<form>`**

Replace the `submitError` div (drop the inner `errorMessage` detail div) with:

```html
        <div
          v-if="submitError"
          class="font-raleway text-base font-light text-red-500"
        >
          {{ $t('pages.contact.errorMessage') }}
        </div>
```

Replace the entire `<form>` element with:

```html
        <form
          @submit.prevent="sendEmail"
          class="flex flex-col gap-4"
        >
          <div class="flex flex-col gap-2">
            <label
              for="name"
              class="font-raleway text-base font-light"
            >
              {{ $t('pages.contact.name') }}
            </label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              @blur="touched.name = true"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('name') }"
            >
            <p
              v-if="shouldShowError('name')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.name }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="email"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.email') }}</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              @blur="touched.email = true"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('email') }"
            >
            <p
              v-if="shouldShowError('email')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.email }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="phone"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.phone') }} {{ $t('pages.contact.phoneOptional') }}</label>
            <input
              type="tel"
              id="phone"
              :value="formData.phone"
              @input="handlePhoneInput"
              @blur="touched.phone = true"
              placeholder="+90 (5__) ___ __ __"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('phone') }"
            >
            <p
              v-if="shouldShowError('phone')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.phone }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="message"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.message') }}</label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="6"
              @blur="touched.message = true"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('message') }"
            ></textarea>
            <p
              v-if="shouldShowError('message')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.message }}
            </p>
          </div>

          <input
            type="text"
            name="website"
            v-model="formData.website"
            class="hidden"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          >

          <div>
            <YazButton
              :label="isSubmitting ? $t('pages.contact.sending') : $t('pages.contact.send')"
              class="w-fit"
              type="primary"
            />
          </div>
        </form>
```

Note: native `required` attributes are intentionally dropped — validation is handled by the computed `errors` with translated messages (matching Checkout). Message label class changes from `block text-sm font-medium` to `font-raleway text-base font-light` for consistency with the other labels.

- [ ] **Step 3: Remove the `subject` key from both language files**

In `src/languages/en.ts` `pages.contact`, delete the line:

```ts
      subject: "Subject",
```

In `src/languages/tr.ts` `pages.contact`, delete the line:

```ts
      subject: "Konu",
```

- [ ] **Step 4: Verify build + manual check**

Run: `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH" && npm run build`
Expected: build completes with no errors.

Then run `npm run dev` and check `/contact` in the browser:
- Submitting empty form shows all three required-field errors, no network call.
- Bad email shows `emailInvalid` after blur.
- Typing `5324316734` in phone renders `+90 (532) 431 67 34`; clearing it back to empty clears the error.
- Submit with valid data fires `POST /api/contact` (will 404 under plain vite dev — that's expected; the route only exists under `vercel dev`/deploy. Confirm the request payload shape in devtools instead.)

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/Contact.vue src/languages/en.ts src/languages/tr.ts
git commit -m "Send contact form via /api/contact with validation and optional TR phone"
```

---

### Task 5: Remove EmailJS dependency

**Files:**
- Modify: `package.json`, `package-lock.json` (remove `@emailjs/browser`)

**Interfaces:**
- Consumes: Task 4 (Contact.vue no longer imports emailjs — verified before uninstall).

- [ ] **Step 1: Confirm no remaining imports**

Run: `grep -rn "emailjs" src/ api/ index.html`
Expected: no matches.

- [ ] **Step 2: Uninstall**

Run: `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH" && npm uninstall @emailjs/browser`
Expected: removed from package.json dependencies.

- [ ] **Step 3: Verify build passes**

Run: `npm run build` (same PATH export)
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "Remove EmailJS dependency"
```

---

## Post-merge manual steps (owner)

1. Ensure `RESEND_API_KEY` is set in Vercel project env (Production + Preview).
2. Delete dead `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_USER_ID` from Vercel env.
3. On a preview deploy: submit the form end-to-end, confirm the structured email arrives at info@yaz-evi.com and Reply-To points at the submitter.
