<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import i18next from 'i18next'

import YazButton from '../atoms/YazButton.vue'
import Loader from '../atoms/Loader.vue'
import type { Booking } from '../../types/booking'

const route = useRoute()
const booking = ref<Partial<Booking> | null>(null)
const loading = ref(true)
const error = ref('')
const status = computed(() => route.query.status as string)

const selectedLanguage = computed(() => i18next.language as string)

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }
  return new Intl.DateTimeFormat(selectedLanguage.value === 'en' ? 'en-US' : 'tr-TR', options).format(d)
}

const formattedTotal = computed(() => {
  if (!booking.value?.paidAmount) return ''
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(booking.value.paidAmount)
})

onMounted(async () => {
  const bookingId = route.params.bookingId as string
  if (!bookingId) {
    error.value = 'Booking not found'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`/api/booking/${bookingId}`)
    if (!response.ok) throw new Error('Failed to fetch booking')

    booking.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="confirmation min-h-screen">
    <div class="max-w-screen-md mx-auto py-16 px-4">
      <div
        v-if="loading"
        class="flex items-center justify-center h-96"
      >
        <Loader />
      </div>

      <div
        v-else-if="error"
        class="text-center"
      >
        <p class="font-raleway text-lg text-red-500">{{ error }}</p>
        <YazButton
          :label="$t('confirmation.backToHome')"
          href="/"
          type="outlined"
          class="mt-6 mx-auto"
        />
      </div>

      <div
        v-else-if="status === 'success' && booking"
        class="flex flex-col items-center gap-6"
      >
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-3xl font-raleway font-light text-center">
          {{ $t('confirmation.title') }}
        </h1>

        <p class="font-raleway text-base text-center text-primary">
          {{ $t('confirmation.subtitle') }}
        </p>

        <div class="w-full bg-white shadow-2xl rounded-2xl p-6 flex flex-col gap-4 mt-4">
          <div class="flex justify-between items-center">
            <p class="font-raleway text-sm text-primary">{{ $t('confirmation.reference') }}</p>
            <p class="font-montserrat font-bold text-base">{{ booking.bookingRef }}</p>
          </div>

          <span class="h-[0.5px] bg-primary"></span>

          <div class="flex justify-between">
            <p class="font-raleway text-sm">{{ $t('confirmation.room') }}</p>
            <p class="font-montserrat text-sm">{{ booking.roomName }}</p>
          </div>

          <div class="flex justify-between">
            <p class="font-raleway text-sm">{{ $t('checkout.checkIn') }}</p>
            <p class="font-montserrat text-sm">{{ formatDate(booking.checkInDate!) }}</p>
          </div>

          <div class="flex justify-between">
            <p class="font-raleway text-sm">{{ $t('checkout.checkOut') }}</p>
            <p class="font-montserrat text-sm">{{ formatDate(booking.checkOutDate!) }}</p>
          </div>

          <div class="flex justify-between">
            <p class="font-raleway text-sm">{{ $t('nights') }}</p>
            <p class="font-montserrat text-sm">{{ booking.nights }}</p>
          </div>

          <span class="h-[0.5px] bg-primary"></span>

          <div class="flex justify-between">
            <p class="font-raleway font-bold text-base">{{ $t('totalPrice') }}</p>
            <p class="font-montserrat font-bold text-base">{{ formattedTotal }}</p>
          </div>
        </div>

        <p class="font-raleway text-sm text-center text-primary mt-2">
          {{ $t('confirmation.emailSent', { email: booking.guestEmail }) }}
        </p>

        <YazButton
          :label="$t('confirmation.backToHome')"
          href="/"
          type="outlined"
          class="mt-4"
        />
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-6"
      >
        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 class="text-3xl font-raleway font-light text-center">
          {{ $t('confirmation.failedTitle') }}
        </h1>

        <p class="font-raleway text-base text-center text-primary">
          {{ $t('confirmation.failedSubtitle') }}
        </p>

        <YazButton
          :label="$t('confirmation.tryAgain')"
          href="/booking"
          type="primary"
          class="mt-4"
        />
      </div>
    </div>
  </section>
</template>
