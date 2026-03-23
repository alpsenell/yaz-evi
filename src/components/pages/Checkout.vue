<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import i18next from 'i18next'

import { useBookingState } from '../../composables/useBookingState'
import type { CheckoutState, GuestInfo } from '../../types/booking'

import YazButton from '../atoms/YazButton.vue'
import Loader from '../atoms/Loader.vue'
import { getMediaUrl } from '../../utils/media'

const router = useRouter()
const { getState } = useBookingState()

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

const isFormValid = computed(() => {
  return (
    guestInfo.value.name.trim() !== '' &&
    guestInfo.value.email.trim() !== '' &&
    guestInfo.value.phone.trim().length > 4 &&
    termsAccepted.value
  )
})

const handleSubmit = async () => {
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
  <section class="checkout min-h-screen">
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
        class="max-w-screen-md mx-auto py-12 px-4"
      >
        <h2 class="text-2xl font-raleway font-light mb-6">
          {{ $t('checkout.payment') }}
        </h2>
        <div v-html="paymentFormContent"></div>
      </div>

      <!-- Checkout form -->
      <div
        v-else
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
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

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
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

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
                v-model="guestInfo.phone"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

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

            <div class="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                v-model="termsAccepted"
                class="mt-1"
              >
              <label
                for="terms"
                class="font-raleway text-sm font-light"
              >
                {{ $t('checkout.termsAccept') }}
              </label>
            </div>

            <div
              v-if="submitError"
              class="font-raleway text-base font-light text-red-500"
            >
              {{ submitError }}
            </div>

            <YazButton
              :label="isSubmitting ? $t('checkout.processing') : $t('checkout.payNow')"
              type="primary"
              class="w-fit"
              :disabled="!isFormValid || isSubmitting"
            />
          </form>

          <!-- Right: Booking summary sidebar -->
          <div class="flex flex-col gap-4 py-6 px-4 shadow-2xl rounded-2xl h-fit sticky top-16 order-first md:order-last">
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

            <div class="flex justify-between">
              <p class="font-raleway text-sm">{{ $t('checkout.pricePerNight') }}</p>
              <p class="font-montserrat text-sm">{{ formattedPricePerNight }}</p>
            </div>

            <div class="flex justify-between">
              <p class="font-raleway font-bold text-base">{{ $t('totalPrice') }}</p>
              <p class="font-montserrat font-bold text-base">{{ formattedTotal }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
