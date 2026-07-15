<script setup lang="ts">
import { getMediaUrl } from '../../utils/media';
</script>

<template>
  <main class="about page-fade bg-cream">
    <!-- Sub hero -->
    <div class="relative h-[420px] md:h-[560px] overflow-hidden">
      <img
        :src="getMediaUrl('windmillshorizontal.jpg')"
        alt="Bozcaada windmills"
        class="absolute inset-0 w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.42)] via-[rgba(16,32,40,0.15)] to-[rgba(16,32,40,0.5)]"></div>
      <div class="absolute left-0 right-0 top-[56%] -translate-y-1/2 text-center text-white px-6">
        <div class="eyebrow-light mb-5">{{ $t('v2.about.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[44px] md:text-[58px] lg:text-[78px] m-0">{{ $t('v2.about.title') }}</h1>
      </div>
    </div>

    <!-- Heading -->
    <div class="max-w-[720px] mx-auto pt-[70px] md:pt-[110px] pb-5 px-6 text-center">
      <h2 class="font-serif font-light text-[40px] md:text-[56px] leading-[1.08] text-ink m-0">{{ $t('v2.about.heading') }}</h2>
      <div class="font-serif italic text-[22px] text-azure mt-2.5">{{ $t('v2.about.headingSub') }}</div>
    </div>

    <!-- Story -->
    <div class="max-w-[720px] mx-auto pt-2.5 px-6 pb-[70px] md:pb-[110px]">
      <p class="body-p about__history" v-html="$t('pages.about.history')"></p>
    </div>

    <!-- Full-bleed image -->
    <div class="relative h-[360px] md:h-[560px]">
      <img
        :src="getMediaUrl('homepage-1-min.jpg')"
        alt="Yaz Evi Bozcaada"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover"
      >
    </div>
  </main>
</template>

<style scoped>
.about__history :deep(br) {
  content: '';
  display: block;
  margin-bottom: 12px;
}
</style>
