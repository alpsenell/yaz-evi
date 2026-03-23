<script setup lang="ts">
import { getMediaUrl } from '../../utils/media'
</script>

<template>
  <section class="booking-terms min-h-screen">
    <div class="relative h-48 md:h-56 overflow-hidden">
      <img
        class="w-full h-full object-cover object-center"
        :src="getMediaUrl('home-gallery/gallery_left_1.jpg')"
        alt="Yaz Evi Bozcaada"
      >
      <div class="absolute inset-0 bg-secondaryDark/40 flex items-center justify-center">
        <h1 class="text-2xl md:text-4xl font-raleway font-light text-white tracking-wide text-center px-4">
          {{ $t('bookingTerms.title') }}
        </h1>
      </div>
    </div>

    <div class="max-w-screen-md mx-auto px-4 py-12">
      <!-- Reservation Terms -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('bookingTerms.reservationTermsTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('bookingTerms.reservationTermsContent') }}
        </p>
      </div>

      <!-- Cancellation Policy -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('bookingTerms.cancellationTitle') }}
        </h2>
        <ul class="flex flex-col gap-3">
          <li class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
            <p class="font-raleway text-sm text-primary leading-relaxed">
              {{ $t('bookingTerms.cancellationFree') }}
            </p>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0"></span>
            <p class="font-raleway text-sm text-primary leading-relaxed">
              {{ $t('bookingTerms.cancellationPartial') }}
            </p>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
            <p class="font-raleway text-sm text-primary leading-relaxed">
              {{ $t('bookingTerms.cancellationLate') }}
            </p>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
            <p class="font-raleway text-sm text-primary leading-relaxed">
              {{ $t('bookingTerms.cancellationNoShow') }}
            </p>
          </li>
        </ul>
      </div>

      <!-- Check-in / Check-out -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('bookingTerms.checkInOutTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('bookingTerms.checkInOutContent') }}
        </p>
      </div>

      <!-- Guest Responsibilities -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('bookingTerms.guestResponsibilitiesTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('bookingTerms.guestResponsibilitiesContent') }}
        </p>
      </div>

      <!-- Privacy -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('bookingTerms.privacyTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('bookingTerms.privacyContent') }}
        </p>
      </div>

      <!-- Contact -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('bookingTerms.contactTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed mb-2">
          {{ $t('bookingTerms.contactContent') }}
        </p>
        <div class="flex flex-col gap-1 font-raleway text-sm text-primary">
          <a href="mailto:info@yaz-evi.com" class="underline hover:text-secondaryDark w-fit">info@yaz-evi.com</a>
          <a href="tel:+905324316734" class="underline hover:text-secondaryDark w-fit">0532 431 67 34</a>
        </div>
      </div>

      <p class="font-raleway text-xs text-gray-400">
        {{ $t('bookingTerms.lastUpdated') }}
      </p>
    </div>
  </section>
</template>
