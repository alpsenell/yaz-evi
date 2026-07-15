<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import i18next from 'i18next'
import { useTranslation } from 'i18next-vue'

import { useBookingState } from '../../composables/useBookingState'
import type { CheckoutState, GuestInfo } from '../../types/booking'

import YazIcon from '../atoms/YazIcon.vue'
import Loader from '../atoms/Loader.vue'
import { getMediaUrl } from '../../utils/media'

const router = useRouter()
const { t } = useTranslation()
const { getState } = useBookingState()

// Online payment is temporarily disabled until the payment provider is configured.
// While false, guests are directed to /contact instead of the iyzipay checkout.
const paymentEnabled: boolean = false

const bookingState = ref<CheckoutState | null>(null)
const isSubmitting = ref(false)
const submitError = ref('')
const showPaymentForm = ref(false)
const paymentFormContent = ref('')

const guestInfo = ref<GuestInfo>({
  name: '',
  email: '',
  phone: '+90 ',
  specialRequests: '',
})

const termsAccepted = ref(false)

const touched = ref({
  name: false,
  email: false,
  phone: false,
  terms: false,
})

const submitAttempted = ref(false)

onMounted(() => {
  const state = getState()
  if (!state) {
    router.replace('/booking')
    return
  }
  bookingState.value = state
})

const selectedLanguage = computed(() => i18next.language as string)

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }
  return new Intl.DateTimeFormat(selectedLanguage.value?.startsWith('en') ? 'en-US' : 'tr-TR', options).format(date)
}

const formattedTotal = computed(() => {
  if (!bookingState.value || bookingState.value.totalPrice <= 0) return ''
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(bookingState.value.totalPrice)
})

// Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const turkishPhoneRegex = /^\+90 \(5\d{2}\) \d{3} \d{2} \d{2}$/

const errors = computed(() => ({
  name: guestInfo.value.name.trim() === '' ? t('validation.nameRequired') : '',
  email: guestInfo.value.email.trim() === ''
    ? t('validation.emailRequired')
    : !emailRegex.test(guestInfo.value.email.trim())
      ? t('validation.emailInvalid')
      : '',
  phone: guestInfo.value.phone.trim().length <= 4
    ? t('validation.phoneRequired')
    : !turkishPhoneRegex.test(guestInfo.value.phone.trim())
      ? t('validation.phoneInvalid')
      : '',
  terms: !termsAccepted.value ? t('validation.termsRequired') : '',
}))

const isFormValid = computed(() => {
  return Object.values(errors.value).every(e => e === '')
})

const shouldShowError = (field: keyof typeof touched.value) => {
  return (touched.value[field] || submitAttempted.value) && errors.value[field]
}

// Phone masking
const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let digits = input.value.replace(/\D/g, '')

  // Remove leading 90 country code if present
  if (digits.startsWith('90')) {
    digits = digits.slice(2)
  }

  // Cap at 10 digits
  digits = digits.slice(0, 10)

  // Format: +90 (5XX) XXX XX XX
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

  guestInfo.value.phone = formatted
  nextTick(() => {
    input.value = formatted
  })
}

const handleSubmit = async () => {
  if (!paymentEnabled) {
    router.push('/contact')
    return
  }

  submitAttempted.value = true

  if (!isFormValid.value || !bookingState.value) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    const response = await fetch('/api/payment/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: bookingState.value.room.id,
        checkIn: bookingState.value.checkIn.toISOString(),
        checkOut: bookingState.value.checkOut.toISOString(),
        nights: bookingState.value.nights,
        pricePerNight: bookingState.value.pricePerNight,
        guest: guestInfo.value,
        locale: selectedLanguage.value,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Payment initialization failed')
    }

    const data = await response.json()
    paymentFormContent.value = data.checkoutFormContent
    showPaymentForm.value = true
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="checkout page-fade bg-cream min-h-screen">
    <div
      v-if="!bookingState"
      class="flex items-center justify-center h-96"
    >
      <Loader />
    </div>

    <template v-else>
      <!-- Payment form overlay -->
      <div
        v-if="showPaymentForm"
        class="max-w-screen-md mx-auto px-6 pt-[120px] md:pt-[150px] pb-[70px]"
      >
        <h2 class="font-serif font-light text-[32px] md:text-[44px] text-ink mt-0 mb-6">
          {{ $t('checkout.payment') }}
        </h2>
        <div v-html="paymentFormContent"></div>
      </div>

      <!-- Checkout form -->
      <div
        v-else
        class="px-6 md:px-14 pt-[120px] md:pt-[150px] pb-[70px] md:pb-[100px]"
      >
        <div class="eyebrow mb-5">{{ $t('v2.booking.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[40px] md:text-[56px] leading-[1.08] text-ink mt-0 mb-10 md:mb-14">
          {{ $t('checkout.title') }}
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-11 md:gap-14 items-start">
          <!-- Left: Guest form -->
          <form
            @submit.prevent="handleSubmit"
            class="flex flex-col gap-7 max-w-[560px]"
          >
            <h2 class="font-serif font-light text-[26px] text-ink m-0">
              {{ $t('checkout.guestInfo') }}
            </h2>

            <!-- Contact note -->
            <div class="font-jost font-light text-sm text-slate -mt-2 flex flex-col gap-2.5">
              <p class="m-0">{{ $t('instagramContactNote') }}</p>
              <div class="flex flex-wrap items-center gap-5">
                <a
                  href="tel:+905324316734"
                  class="flex items-center gap-2 text-azure hover:text-ink transition-colors"
                >
                  <YazIcon name="phone" :size="16" color="currentColor" />
                  <span>0532 431 67 34</span>
                </a>
                <a
                  href="https://www.instagram.com/yazevibozcaada_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-azure hover:text-ink transition-colors"
                >
                  <YazIcon name="instagram" :size="16" color="currentColor" />
                  <span>yazevibozcaada_</span>
                </a>
              </div>
            </div>

            <!-- Name -->
            <div>
              <label
                for="guest-name"
                class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5"
              >
                {{ $t('checkout.name') }} *
              </label>
              <input
                type="text"
                id="guest-name"
                v-model="guestInfo.name"
                @blur="touched.name = true"
                class="w-full border-0 border-b bg-transparent py-2 font-jost text-base text-ink outline-none rounded-none"
                :class="shouldShowError('name') ? 'border-red-500' : 'border-[#C9BDA4] focus:border-azure'"
              >
              <p
                v-if="shouldShowError('name')"
                class="font-jost text-xs text-red-600 mt-1.5 mb-0"
              >
                {{ errors.name }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label
                for="guest-email"
                class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5"
              >
                {{ $t('checkout.email') }} *
              </label>
              <input
                type="email"
                id="guest-email"
                v-model="guestInfo.email"
                @blur="touched.email = true"
                class="w-full border-0 border-b bg-transparent py-2 font-jost text-base text-ink outline-none rounded-none"
                :class="shouldShowError('email') ? 'border-red-500' : 'border-[#C9BDA4] focus:border-azure'"
              >
              <p
                v-if="shouldShowError('email')"
                class="font-jost text-xs text-red-600 mt-1.5 mb-0"
              >
                {{ errors.email }}
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label
                for="guest-phone"
                class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5"
              >
                {{ $t('checkout.phone') }} *
              </label>
              <input
                type="tel"
                id="guest-phone"
                :value="guestInfo.phone"
                @input="handlePhoneInput"
                @blur="touched.phone = true"
                placeholder="+90 (5__) ___ __ __"
                class="w-full border-0 border-b bg-transparent py-2 font-jost text-base text-ink outline-none rounded-none placeholder:text-stone"
                :class="shouldShowError('phone') ? 'border-red-500' : 'border-[#C9BDA4] focus:border-azure'"
              >
              <p
                v-if="shouldShowError('phone')"
                class="font-jost text-xs text-red-600 mt-1.5 mb-0"
              >
                {{ errors.phone }}
              </p>
            </div>

            <!-- Special Requests -->
            <div>
              <label
                for="special-requests"
                class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5"
              >
                {{ $t('checkout.specialRequests') }}
              </label>
              <textarea
                id="special-requests"
                v-model="guestInfo.specialRequests"
                rows="4"
                class="w-full border border-[#C9BDA4] bg-transparent p-3 font-jost text-[15px] text-ink outline-none focus:border-azure resize-y min-h-[110px] rounded-none"
              ></textarea>
            </div>

            <!-- Terms -->
            <div>
              <div class="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  v-model="termsAccepted"
                  @change="touched.terms = true"
                  class="mt-1 accent-ink"
                >
                <label
                  for="terms"
                  class="font-jost font-light text-sm text-slate"
                >
                  {{ $t('checkout.termsAcceptPrefix') }}<a
                    href="/booking-terms"
                    target="_blank"
                    class="underline text-azure hover:text-ink transition-colors"
                  >{{ $t('checkout.termsAcceptLink') }}</a>{{ $t('checkout.termsAcceptSuffix') }}
                </label>
              </div>
              <p
                v-if="shouldShowError('terms')"
                class="font-jost text-xs text-red-600 mt-1.5 mb-0 ml-7"
              >
                {{ errors.terms }}
              </p>
            </div>

            <div
              v-if="submitError"
              class="font-jost text-sm text-red-600 border border-red-400 px-5 py-4"
            >
              {{ submitError }}
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-solid-ink border-none w-full disabled:opacity-60"
            >
              {{ isSubmitting ? $t('checkout.processing') : paymentEnabled ? $t('checkout.payNow') : $t('v2.getInTouch') }}
            </button>
          </form>

          <!-- Right: Booking summary sidebar -->
          <div class="bg-ink text-parchment h-fit md:sticky md:top-28 order-first md:order-last">
            <div class="relative h-[200px]">
              <img
                class="absolute inset-0 w-full h-full object-cover"
                :src="getMediaUrl(bookingState.room.image)"
                :alt="$t(bookingState.room.title)"
              >
            </div>
            <div class="p-7 md:p-8">
              <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azureSoft mb-2.5">{{ $t('checkout.summary') }}</div>
              <h2 class="font-serif font-light text-[32px] mt-0 mb-1 capitalize">{{ bookingState.room.name }}</h2>
              <p class="font-jost font-light text-[13px] text-[#a9bcc2] mt-0 mb-5">
                {{ bookingState.room.bookingInformation.size }} m² · {{ bookingState.room.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}
              </p>
              <div class="grid grid-cols-2 gap-4 pb-5 border-b border-white/15">
                <div>
                  <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('checkout.checkIn') }}</div>
                  <div class="font-serif text-xl">{{ formatDate(bookingState.checkIn) }}</div>
                </div>
                <div>
                  <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('checkout.checkOut') }}</div>
                  <div class="font-serif text-xl">{{ formatDate(bookingState.checkOut) }}</div>
                </div>
                <div>
                  <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('v2.nights') }}</div>
                  <div class="font-serif text-xl">{{ bookingState.nights }}</div>
                </div>
                <div>
                  <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('v2.guests') }}</div>
                  <div class="font-serif text-xl">{{ bookingState.guests }}</div>
                </div>
              </div>
              <div class="flex items-center justify-between pt-5">
                <span class="font-jost text-xs tracking-[0.2em] uppercase text-azureSoft">{{ $t('v2.booking.total') }}</span>
                <span v-if="formattedTotal" class="font-serif text-[22px]">{{ formattedTotal }}</span>
                <router-link
                  v-else
                  to="/contact"
                  class="font-serif italic text-[22px] underline decoration-1 underline-offset-4 hover:text-azureSoft transition-colors"
                >{{ $t('v2.booking.onRequest') }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
