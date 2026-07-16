<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { ROOMS } from '../../enums/global'
import { getMediaUrl } from '../../utils/media'
import { capitalize } from '../../utils/analytics'
import Lightbox from '../organisms/Lightbox.vue'

const route = useRoute()

const room = computed(() => {
  return ROOMS.find(r => r.slug === route.params.slug) ?? null
})

const roomTrackName = computed(() => capitalize(room.value?.slug ?? ''))

const galleryUrls = computed(() => room.value ? room.value.images.map(image => getMediaUrl(image)) : [])

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <main v-if="room" class="room-detail page-fade bg-cream">
    <!-- Hero -->
    <div class="relative h-[620px] md:h-[900px] overflow-hidden">
      <img
        :src="getMediaUrl(room.image)"
        :alt="room.name"
        class="absolute inset-0 w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.4)] via-transparent to-[rgba(16,32,40,0.62)]"></div>
      <div class="absolute left-0 right-0 bottom-14 text-center text-white px-6">
        <div class="eyebrow-light mb-5">{{ $t('v2.roomPage.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[46px] md:text-[64px] lg:text-[92px] leading-[1.02] m-0 capitalize">{{ room.name }}</h1>
        <div class="font-serif italic text-[22px] opacity-85 mt-1.5">{{ $t(`v2.roomTags.${room.slug}`) }}</div>
      </div>
    </div>

    <!-- About + facts -->
    <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 md:gap-20 px-6 md:px-14 pt-[70px] md:pt-[110px] pb-[60px] md:pb-[90px]">
      <div>
        <div class="eyebrow mb-5">{{ $t('v2.roomPage.about') }}</div>
        <h2 class="font-serif font-light text-[32px] md:text-[44px] leading-[1.1] text-ink mt-0 mb-5 capitalize">{{ room.name }}</h2>
        <p class="body-p max-w-[560px] whitespace-pre-line">{{ $t(room.description) }}</p>
      </div>
      <div class="border border-sand bg-white p-8 md:p-9 h-fit">
        <div class="font-serif text-[22px] text-ink mb-5">{{ $t('v2.roomPage.details') }}</div>
        <div class="flex justify-between py-3.5 border-b border-sandLight">
          <span class="font-jost text-xs tracking-[0.14em] uppercase text-[#8a8474]">{{ $t('v2.roomPage.size') }}</span>
          <span class="font-jost text-[15px] text-ink">{{ room.bookingInformation.size }} m²</span>
        </div>
        <div class="flex justify-between py-3.5 border-b border-sandLight">
          <span class="font-jost text-xs tracking-[0.14em] uppercase text-[#8a8474]">{{ $t('v2.roomPage.capacity') }}</span>
          <span class="font-jost text-[15px] text-ink">{{ room.bookingInformation.guestNumber }} {{ $t('v2.roomPage.guests') }}</span>
        </div>
        <div class="flex justify-between py-3.5 border-b border-sandLight">
          <span class="font-jost text-xs tracking-[0.14em] uppercase text-[#8a8474]">{{ $t('v2.roomPage.bed') }}</span>
          <span class="font-jost text-[15px] text-ink">{{ room.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}</span>
        </div>
        <div class="flex justify-between py-3.5 border-b border-sandLight">
          <span class="font-jost text-xs tracking-[0.14em] uppercase text-[#8a8474]">{{ $t('v2.roomPage.bathroom') }}</span>
          <span class="font-jost text-[15px] text-ink">{{ room.bookingInformation.bathroom }}</span>
        </div>
        <router-link :to="`/booking?room=${room.slug}`" class="btn-solid-ink mt-6" v-track="`clickOnRoomCtaBook${roomTrackName}`">{{ $t('v2.book') }}</router-link>
        <router-link
          to="/contact"
          class="block text-center font-jost text-xs tracking-[0.24em] uppercase text-azure mt-4 cursor-pointer"
        >{{ $t('v2.getInTouch') }}</router-link>
      </div>
    </div>

    <!-- Gallery -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-14 pb-[70px] md:pb-[110px]">
      <button
        v-for="(image, index) in room.images"
        :key="index"
        type="button"
        class="relative h-[260px] lg:h-[380px] overflow-hidden cursor-pointer group bg-transparent border-none p-0"
        :aria-label="`${room.name} ${index + 1}`"
        v-track="`clickOnRoomGalleryImage${roomTrackName}`"
        @click="openLightbox(index)"
      >
        <img
          :src="getMediaUrl(image)"
          :alt="`${room.name} - ${index + 1}`"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        >
      </button>
    </div>

    <Lightbox
      :open="lightboxOpen"
      :images="galleryUrls"
      v-model:index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </main>
</template>
