<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide'

import { ROOMS } from '../../enums/global'
import { getMediaUrl } from '../../utils/media'
import YazButton from '../atoms/YazButton.vue'
import YazIcon from '../atoms/YazIcon.vue'

const route = useRoute()

const room = computed(() => {
  return ROOMS.find(r => r.id === route.params.id) ?? null
})

const otherRooms = computed(() => {
  return ROOMS.filter(r => r.id !== route.params.id)
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const prevImage = () => {
  if (!room.value) return
  lightboxIndex.value = (lightboxIndex.value - 1 + room.value.images.length) % room.value.images.length
}

const nextImage = () => {
  if (!room.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % room.value.images.length
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<template>
  <div v-if="room" class="room-detail full-height-section">
    <!-- Hero gallery -->
    <div class="relative h-[50vh] md:h-[65vh] overflow-hidden">
      <Splide
        class="h-full"
        :has-track="false"
        :options="{ perPage: 1, type: 'loop', pagination: false }"
      >
        <SplideTrack class="h-full">
          <SplideSlide
            v-for="(image, index) in room.images"
            :key="index"
            class="cursor-pointer"
            @click="openLightbox(index)"
          >
            <img
              class="w-full h-full object-cover"
              :src="getMediaUrl(image)"
              :alt="`${$t(room.title)} - ${index + 1}`"
            >
          </SplideSlide>
        </SplideTrack>

        <div class="splide__arrows absolute bottom-4 right-4">
          <button class="splide__arrow splide__arrow--prev relative">
            <YazIcon name="left" color="white" />
          </button>
          <button class="splide__arrow splide__arrow--next relative">
            <YazIcon name="right" color="white" />
          </button>
        </div>
      </Splide>

      <!-- Overlay with room name -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      <div class="absolute bottom-8 left-6 md:left-12 pointer-events-none">
        <h1 class="text-3xl md:text-5xl font-raleway font-light text-white tracking-wide">
          {{ $t(room.title) }}
        </h1>
      </div>
    </div>

    <!-- Quick info bar -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-screen-lg mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap gap-6 md:gap-10">
          <div class="flex items-center gap-2">
            <span class="font-raleway text-xs text-primary uppercase tracking-wider">{{ $t('roomDetail.size') }}</span>
            <span class="font-montserrat text-sm text-secondaryDark font-medium">{{ room.bookingInformation.size }}m²</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-raleway text-xs text-primary uppercase tracking-wider">{{ $t('roomDetail.capacity') }}</span>
            <span class="font-montserrat text-sm text-secondaryDark font-medium">{{ room.bookingInformation.guestNumber }} {{ $t('roomDetail.guests') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-raleway text-xs text-primary uppercase tracking-wider">{{ $t('roomDetail.bedType') }}</span>
            <span class="font-montserrat text-sm text-secondaryDark font-medium">
              {{ room.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}
            </span>
          </div>
        </div>
        <YazButton
          :label="$t('roomDetail.bookThisRoom')"
          type="primary"
          href="/booking"
          class="hidden md:flex"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-screen-lg mx-auto px-4 py-12 md:py-16">
      <!-- About section -->
      <div class="mb-16">
        <h2 class="font-raleway text-2xl font-light text-secondaryDark mb-6">
          {{ $t('roomDetail.about') }}
        </h2>
        <p class="font-raleway text-base text-primary leading-relaxed max-w-2xl whitespace-pre-line">
          {{ $t(room.description) }}
        </p>
      </div>

      <!-- Amenities grid -->
      <div class="mb-16">
        <h2 class="font-raleway text-2xl font-light text-secondaryDark mb-6">
          {{ $t('roomDetail.amenities') }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="feature in room.bookingInformation.features"
            :key="feature"
            class="flex items-center gap-3 py-3 px-4 rounded-lg bg-tertiary/40"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span class="font-raleway text-sm text-secondaryDark">
              {{ $t(`roomInformation.${feature}`) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Photo grid -->
      <div class="mb-16">
        <h2 class="font-raleway text-2xl font-light text-secondaryDark mb-6">
          {{ $t('gallery') }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="(image, index) in room.images"
            :key="index"
            class="relative overflow-hidden rounded-lg cursor-pointer group aspect-[4/3]"
            @click="openLightbox(index)"
          >
            <img
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              :src="getMediaUrl(image)"
              :alt="`${$t(room.title)} - ${index + 1}`"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center py-8 border-t border-gray-100">
        <YazButton
          :label="$t('roomDetail.bookThisRoom')"
          type="primary"
          href="/booking"
          class="mx-auto w-fit"
        />
      </div>

      <!-- Other rooms -->
      <div class="pt-12 border-t border-gray-100">
        <h2 class="font-raleway text-2xl font-light text-secondaryDark mb-8 text-center">
          {{ $t('roomDetail.otherRooms') }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link
            v-for="other in otherRooms"
            :key="other.id"
            :to="`/room/${other.id}`"
            class="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div class="relative aspect-[3/4] overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                :src="getMediaUrl(other.image)"
                :alt="$t(other.title)"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div class="absolute bottom-3 left-3">
                <p class="font-raleway text-sm font-medium text-white">{{ $t(other.title) }}</p>
                <p class="font-raleway text-xs text-white/70">{{ other.bookingInformation.size }}m²</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <button
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
          @click="closeLightbox"
        >
          <YazIcon name="cross" color="white" :size="20" />
        </button>

        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
          @click="prevImage"
        >
          <YazIcon name="left" color="white" :size="24" />
        </button>

        <img
          :src="getMediaUrl(room.images[lightboxIndex])"
          :alt="`${$t(room.title)} - ${lightboxIndex + 1}`"
          class="max-h-[85vh] max-w-[90vw] object-contain"
        >

        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
          @click="nextImage"
        >
          <YazIcon name="right" color="white" :size="24" />
        </button>

        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 font-montserrat text-sm text-white/60">
          {{ lightboxIndex + 1 }} / {{ room.images.length }}
        </div>
      </div>
    </Teleport>
  </div>

  <!-- Room not found -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="font-raleway text-lg text-primary mb-4">Room not found</p>
      <YazButton label="Back to Rooms" type="primary" href="/rooms" />
    </div>
  </div>
</template>
