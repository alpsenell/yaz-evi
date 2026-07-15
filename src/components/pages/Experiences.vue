<script setup lang="ts">
import { getMediaUrl } from '../../utils/media';
</script>

<template>
  <main class="experiences page-fade bg-cream">
    <!-- Sub hero -->
    <div class="relative h-[420px] md:h-[560px] overflow-hidden">
      <video
        class="absolute inset-0 w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        :poster="getMediaUrl('experience-video-media.png')"
      >
        <source
          :src="getMediaUrl('experiences.MOV')"
          type="video/mp4"
        >
      </video>
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.42)] via-[rgba(16,32,40,0.15)] to-[rgba(16,32,40,0.5)]"></div>
      <div class="absolute left-0 right-0 top-[56%] -translate-y-1/2 text-center text-white px-6">
        <div class="eyebrow-light mb-5">{{ $t('v2.experiences.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[44px] md:text-[58px] lg:text-[78px] m-0">{{ $t('v2.experiences.title') }}</h1>
        <div class="font-serif italic text-[24px] opacity-90 mt-2">{{ $t('v2.experiences.sub') }}</div>
      </div>
    </div>

    <!-- Intro quote -->
    <div class="text-center pt-[70px] md:pt-[110px] pb-5 px-6 md:px-14 max-w-[820px] mx-auto">
      <p class="font-serif font-light italic text-[24px] md:text-[30px] leading-[1.5] text-ink m-0">
        {{ $t('v2.experiences.intro') }}
      </p>
    </div>

    <!-- Section 01 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[76px] items-center px-6 md:px-14 py-[60px] md:py-20">
      <div class="relative h-[360px] md:h-[560px]">
        <img :src="getMediaUrl('homepage-6-min.jpg')" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
      </div>
      <div>
        <div class="font-serif text-4xl text-gold mb-3.5">01</div>
        <h2 class="font-serif font-light text-[32px] md:text-[44px] leading-[1.1] text-ink mt-0 mb-5">{{ $t('v2.experiences.s1Title') }}</h2>
        <p class="body-p max-w-[460px] m-0">{{ $t('v2.experiences.s1Body') }}</p>
      </div>
    </div>

    <!-- Section 02 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[76px] items-center px-6 md:px-14 pb-[60px] md:pb-20">
      <div class="order-2 md:order-1">
        <div class="font-serif text-4xl text-gold mb-3.5">02</div>
        <h2 class="font-serif font-light text-[32px] md:text-[44px] leading-[1.1] text-ink mt-0 mb-5">{{ $t('v2.experiences.s2Title') }}</h2>
        <p class="body-p max-w-[460px] m-0">{{ $t('v2.experiences.s2Body') }}</p>
      </div>
      <div class="order-1 md:order-2 relative h-[360px] md:h-[560px]">
        <img :src="getMediaUrl('homepage-2-min.jpg')" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
      </div>
    </div>

    <!-- Ink CTA -->
    <div class="bg-ink text-parchment text-center px-6 md:px-14 py-[90px] md:py-[150px]">
      <h2 class="font-serif font-light text-[44px] md:text-[70px] leading-[1.12] m-0">{{ $t('v2.experiences.ctaTitle') }}</h2>
      <router-link to="/contact" class="btn-outline-light mt-11">{{ $t('v2.getInTouch') }}</router-link>
    </div>
  </main>
</template>
