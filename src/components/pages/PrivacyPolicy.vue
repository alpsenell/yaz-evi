<script setup lang="ts">
import { getMediaUrl } from '../../utils/media'
</script>

<template>
  <section class="privacy-policy min-h-screen">
    <div class="relative h-48 md:h-56 overflow-hidden">
      <img
        class="w-full h-full object-cover object-center"
        :src="getMediaUrl('home-gallery/gallery_left_1.jpg')"
        alt="Yaz Evi Bozcaada"
      >
      <div class="absolute inset-0 bg-secondaryDark/40 flex items-center justify-center">
        <h1 class="text-2xl md:text-4xl font-raleway font-light text-white tracking-wide text-center px-4">
          {{ $t('privacyPolicy.title') }}
        </h1>
      </div>
    </div>

    <div class="max-w-screen-md mx-auto px-4 py-12">
      <!-- Data Controller -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.dataControllerTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('privacyPolicy.dataControllerContent') }}
        </p>
      </div>

      <!-- Collected Data -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.collectedDataTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('privacyPolicy.collectedDataContent') }}
        </p>
      </div>

      <!-- Purpose of Processing -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.purposeTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('privacyPolicy.purposeContent') }}
        </p>
      </div>

      <!-- Data Sharing -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.dataSharingTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('privacyPolicy.dataSharingContent') }}
        </p>
      </div>

      <!-- Cookies -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.cookiesTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('privacyPolicy.cookiesContent') }}
        </p>
      </div>

      <!-- Data Security -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.dataSecurityTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('privacyPolicy.dataSecurityContent') }}
        </p>
      </div>

      <!-- User Rights -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.userRightsTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed">
          {{ $t('privacyPolicy.userRightsContent') }}
        </p>
      </div>

      <!-- Contact -->
      <div class="mb-10">
        <h2 class="font-raleway text-xl font-medium text-secondaryDark mb-3">
          {{ $t('privacyPolicy.contactTitle') }}
        </h2>
        <p class="font-raleway text-sm text-primary leading-relaxed mb-2">
          {{ $t('privacyPolicy.contactContent') }}
        </p>
        <div class="flex flex-col gap-1 font-raleway text-sm text-primary">
          <a href="mailto:info@yaz-evi.com" class="underline hover:text-secondaryDark w-fit">info@yaz-evi.com</a>
          <a href="tel:+905324316734" class="underline hover:text-secondaryDark w-fit">0532 431 67 34</a>
        </div>
      </div>

      <p class="font-raleway text-xs text-gray-400">
        {{ $t('privacyPolicy.lastUpdated') }}
      </p>
    </div>
  </section>
</template>
