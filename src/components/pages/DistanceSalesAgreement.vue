<script setup lang="ts">
import { getMediaUrl } from '../../utils/media'
</script>

<template>
  <section class="distance-sales min-h-screen">
    <div class="relative h-48 md:h-56 overflow-hidden">
      <img
        class="w-full h-full object-cover object-center"
        :src="getMediaUrl('home-gallery/gallery_left_1.jpg')"
        alt="Yaz Evi Bozcaada"
      >
      <div class="absolute inset-0 bg-secondaryDark/40 flex items-center justify-center">
        <h1 class="text-2xl md:text-4xl font-raleway font-light text-white tracking-wide text-center px-4">
          {{ $t('distanceSales.title') }}
        </h1>
      </div>
    </div>

    <div class="max-w-screen-md mx-auto px-4 py-12">
      <!-- Parties -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.partiesTitle') }}
        </h2>
        <div class="font-raleway text-sm text-primary leading-relaxed">
          <p class="font-medium mb-2">{{ $t('distanceSales.sellerTitle') }}</p>
          <p>{{ $t('distanceSales.sellerName') }}</p>
          <p>{{ $t('distanceSales.sellerAddress') }}</p>
          <p>{{ $t('distanceSales.sellerPhone') }}</p>
          <p>{{ $t('distanceSales.sellerEmail') }}</p>
        </div>
      </div>

      <!-- Subject -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.subjectTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('distanceSales.subjectContent') }}
        </p>
      </div>

      <!-- Service Details -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.serviceDetailsTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('distanceSales.serviceDetailsContent') }}
        </p>
      </div>

      <!-- Price and Payment -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.priceTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('distanceSales.priceContent') }}
        </p>
      </div>

      <!-- Right of Withdrawal -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.withdrawalTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('distanceSales.withdrawalContent') }}
        </p>
      </div>

      <!-- Cancellation -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.cancellationTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('distanceSales.cancellationContent') }}
        </p>
      </div>

      <!-- Responsibilities -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.responsibilitiesTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('distanceSales.responsibilitiesContent') }}
        </p>
      </div>

      <!-- Dispute Resolution -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('distanceSales.disputeTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('distanceSales.disputeContent') }}
        </p>
      </div>

      <!-- Acceptance -->
      <div class="mb-10">
        <p class="font-raleway text-sm text-primary leading-relaxed italic">
          {{ $t('distanceSales.acceptanceContent') }}
        </p>
      </div>

      <p class="font-raleway text-xs text-gray-400">
        {{ $t('distanceSales.lastUpdated') }}
      </p>
    </div>
  </section>
</template>
