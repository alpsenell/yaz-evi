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
import { trackEvent } from '../../utils/analytics'
import { emailRegex, turkishPhoneRegex, formatTurkishPhone } from '../../utils/validation'

const router = useRouter()
const { t } = useTranslation()
const { getState } = useBookingState()

const bookingState = ref<CheckoutState | null>(null)

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

const shouldShowError = (field: keyof typeof touched.value) => {
  return touched.value[field] && errors.value[field]
}

// Phone masking
const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const formatted = formatTurkishPhone(input.value)

  guestInfo.value.phone = formatted
  nextTick(() => {
    input.value = formatted
  })
}

// Online payment is not available; guests complete their reservation via /contact.
const handleSubmit = () => {
  trackEvent('submitCheckoutForm')
  router.push('/contact')
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
      <!-- Checkout form -->
      <div
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
                  v-track="'clickOnCheckoutPhone'"
                >
                  <YazIcon name="phone" :size="16" color="currentColor" />
                  <span>0532 431 67 34</span>
                </a>
                <a
                  href="https://www.instagram.com/yazevibozcaada_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-azure hover:text-ink transition-colors"
                  v-track="'clickOnCheckoutInstagram'"
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
                    v-track="'clickOnCheckoutTermsLink'"
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

            <button
              type="submit"
              class="btn-solid-ink border-none w-full"
            >
              {{ $t('v2.getInTouch') }}
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
                  v-track="'clickOnCheckoutSummaryGetInTouch'"
                >{{ $t('v2.booking.onRequest') }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
