<script setup lang="ts">
import { getMediaUrl } from '../../utils/media'
</script>

<template>
  <section class="delivery-return min-h-screen">
    <div class="relative h-48 md:h-56 overflow-hidden">
      <img
        class="w-full h-full object-cover object-center"
        :src="getMediaUrl('home-gallery/gallery_left_1.jpg')"
        alt="Yaz Evi Bozcaada"
      >
      <div class="absolute inset-0 bg-secondaryDark/40 flex items-center justify-center">
        <h1 class="text-2xl md:text-4xl font-raleway font-light text-white tracking-wide text-center px-4">
          {{ $t('deliveryAndReturn.title') }}
        </h1>
      </div>
    </div>

    <div class="max-w-screen-md mx-auto px-4 py-12">
      <!-- Service Delivery -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('deliveryAndReturn.serviceDeliveryTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('deliveryAndReturn.serviceDeliveryContent') }}
        </p>
      </div>

      <!-- Check-in / Check-out -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('deliveryAndReturn.checkInOutTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('deliveryAndReturn.checkInOutContent') }}
        </p>
      </div>

      <!-- Refund Policy -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('deliveryAndReturn.refundTitle') }}
        </h2>
        <ul class="flex flex-col gap-3">
          <li class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
            <p class="font-raleway text-sm text-primary leading-relaxed">
              {{ $t('deliveryAndReturn.refundFree') }}
            </p>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0"></span>
            <p class="font-raleway text-sm text-primary leading-relaxed">
              {{ $t('deliveryAndReturn.refundPartial') }}
            </p>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
            <p class="font-raleway text-sm text-primary leading-relaxed">
              {{ $t('deliveryAndReturn.refundLate') }}
            </p>
          </li>
        </ul>
      </div>

      <!-- Refund Process -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('deliveryAndReturn.refundProcessTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('deliveryAndReturn.refundProcessContent') }}
        </p>
      </div>

      <!-- Force Majeure -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('deliveryAndReturn.forceMajeureTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('deliveryAndReturn.forceMajeureContent') }}
        </p>
      </div>

      <!-- Contact -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('deliveryAndReturn.contactTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed mb-2">
          {{ $t('deliveryAndReturn.contactContent') }}
        </p>
        <div class="flex flex-col gap-1 font-raleway text-sm text-primary">
          <a href="mailto:info@yaz-evi.com" class="underline hover:text-secondaryDark w-fit">info@yaz-evi.com</a>
          <a href="tel:+905324316734" class="underline hover:text-secondaryDark w-fit">0532 431 67 34</a>
        </div>
      </div>

      <p class="font-raleway text-xs text-gray-400">
        {{ $t('deliveryAndReturn.lastUpdated') }}
      </p>
    </div>
  </section>
</template>
