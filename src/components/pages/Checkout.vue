<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import i18next from 'i18next'
import { useTranslation } from 'i18next-vue'

import { useBookingState } from '../../composables/useBookingState'
import type { CheckoutState, GuestInfo } from '../../types/booking'

import YazButton from '../atoms/YazButton.vue'
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
  return new Intl.DateTimeFormat(selectedLanguage.value === 'en' ? 'en-US' : 'tr-TR', options).format(date)
}

const formattedTotal = computed(() => {
  if (!bookingState.value) return ''
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(bookingState.value.totalPrice)
})

const formattedPricePerNight = computed(() => {
  if (!bookingState.value) return ''
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(bookingState.value.pricePerNight)
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
  <section class="checkout min-h-screen">
    <div
      v-if="!bookingState"
      class="flex items-center justify-center h-96"
    >
      <Loader />
    </div>

    <template v-else>
      <!-- Checkout form -->
      <div
        class="max-w-screen-xl mx-auto py-12 px-4"
      >
        <h1 class="text-3xl font-raleway font-light mb-8">
          {{ $t('checkout.title') }}
        </h1>

        <div class="flex flex-col md:grid md:grid-cols-[1fr_380px] gap-8">
          <!-- Left: Guest form -->
          <form
            @submit.prevent="handleSubmit"
            class="flex flex-col gap-6"
          >
            <h2 class="text-xl font-raleway font-light">
              {{ $t('checkout.guestInfo') }}
            </h2>

            <!-- Contact note -->
            <div class="font-raleway text-sm text-primary -mt-2 flex flex-col gap-2">
              <p>{{ $t('instagramContactNote') }}</p>
              <div class="flex items-center gap-4">
                <a
                  href="tel:+905324316734"
                  class="flex items-center gap-2 hover:text-secondaryDark transition-colors"
                  v-track="'clickOnCheckoutPhone'"
                >
                  <YazIcon name="phone" :size="18" color="currentColor" />
                  <span>0532 431 67 34</span>
                </a>
                <a
                  href="https://www.instagram.com/yazevibozcaada_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 hover:text-secondaryDark transition-colors"
                  v-track="'clickOnCheckoutInstagram'"
                >
                  <YazIcon name="instagram" :size="18" color="currentColor" />
                  <span>yazevibozcaada_</span>
                </a>
              </div>
            </div>

            <!-- Name -->
            <div class="flex flex-col gap-2">
              <label
                for="guest-name"
                class="font-raleway text-base font-light"
              >
                {{ $t('checkout.name') }} *
              </label>
              <input
                type="text"
                id="guest-name"
                v-model="guestInfo.name"
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

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label
                for="guest-email"
                class="font-raleway text-base font-light"
              >
                {{ $t('checkout.email') }} *
              </label>
              <input
                type="email"
                id="guest-email"
                v-model="guestInfo.email"
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

            <!-- Phone -->
            <div class="flex flex-col gap-2">
              <label
                for="guest-phone"
                class="font-raleway text-base font-light"
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

            <!-- Special Requests -->
            <div class="flex flex-col gap-2">
              <label
                for="special-requests"
                class="font-raleway text-base font-light"
              >
                {{ $t('checkout.specialRequests') }}
              </label>
              <textarea
                id="special-requests"
                v-model="guestInfo.specialRequests"
                rows="4"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <!-- Terms -->
            <div class="flex flex-col gap-1">
              <div class="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  v-model="termsAccepted"
                  @change="touched.terms = true"
                  class="mt-1"
                >
                <label
                  for="terms"
                  class="font-raleway text-sm font-light"
                >
                  {{ $t('checkout.termsAcceptPrefix') }}<a
                    href="/booking-terms"
                    target="_blank"
                    class="underline text-primary hover:text-secondaryDark"
                    v-track="'clickOnCheckoutTermsLink'"
                  >{{ $t('checkout.termsAcceptLink') }}</a>{{ $t('checkout.termsAcceptSuffix') }}
                </label>
              </div>
              <p
                v-if="shouldShowError('terms')"
                class="font-raleway text-xs text-red-500 ml-5"
              >
                {{ errors.terms }}
              </p>
            </div>

            <YazButton
              :label="$t('getInTouch')"
              type="primary"
              href="/contact"
              class="w-fit"
              v-track="'clickOnCheckoutGetInTouch'"
            />
          </form>

          <!-- Right: Booking summary sidebar -->
          <div class="flex flex-col gap-4 py-6 px-4 shadow-2xl rounded-2xl h-fit md:sticky top-16 order-first md:order-last">
            <h2 class="text-lg font-raleway font-light">
              {{ $t('checkout.summary') }}
            </h2>

            <img
              class="w-full h-48 object-cover rounded-lg"
              :src="getMediaUrl(bookingState.room.image)"
              :alt="$t(bookingState.room.title)"
            >

            <p class="font-raleway font-bold text-lg">
              {{ $t(bookingState.room.title) }}
            </p>

            <span class="h-[0.5px] bg-primary"></span>

            <div class="flex flex-col gap-1">
              <div class="flex justify-between">
                <p class="font-raleway text-sm">{{ $t('checkout.checkIn') }}</p>
                <p class="font-montserrat text-sm">{{ formatDate(bookingState.checkIn) }}</p>
              </div>
              <div class="flex justify-between">
                <p class="font-raleway text-sm">{{ $t('checkout.checkOut') }}</p>
                <p class="font-montserrat text-sm">{{ formatDate(bookingState.checkOut) }}</p>
              </div>
            </div>

            <span class="h-[0.5px] bg-primary"></span>

            <div class="flex justify-between">
              <p class="font-raleway text-sm">{{ bookingState.nights }} {{ $t('nights') }}</p>
              <p class="font-raleway text-sm">{{ bookingState.guests }} {{ $t('guests') }}</p>
            </div>

            <span class="h-[0.5px] bg-primary"></span>

            <div class="flex justify-between items-center">
              <p class="font-raleway font-bold text-base">{{ $t('totalPrice') }}</p>
              <router-link
                to="/contact"
                class="font-raleway font-bold text-base underline hover:text-secondaryDark transition-colors"
                v-track="'clickOnCheckoutSummaryGetInTouch'"
              >
                {{ $t('getInTouch') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
