<script setup lang="ts">
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import YazIcon from "../atoms/YazIcon.vue";
import YazButton from "../atoms/YazButton.vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  room: {
    type: Object,
    required: true,
  },
  nightNumber: {
    type: Number,
    required: true,
  },
  guestNumber: {
    type: Number,
    required: true,
  },
});

function getImageUrl(image) {
  return new URL(`../../assets/media/${image}`, import.meta.url)
}
</script>

<template>
  <div class="booking-card shadow-2xl rounded-2xl overflow-hidden">
    <div class="booking-card__content flex flex-col md:grid md:grid-cols-[300px_1fr]">
      <div class="booking-card__slider relative">
        <Splide
          :has-track="false"
          :options="{ perPage: 1, type: 'loop', pagination: false }"
        >
          <SplideTrack>
            <SplideSlide
              v-for="(image, index) in images"
              :key="index"
              class="aspect-square"
            >
              <img
                class="h-full w-full object-cover"
                :src="getImageUrl(image)"
                :alt="`Image of ${title}-${index + 1}`"
              />
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
      </div>

      <div class="booking-card__information px-4">
        <div class="flex flex-col gap-2 mt-3">
          <div class="text-lg font-raleway">
            {{ $t(room.title) }}
          </div>
          <div class="flex gap-2">
            <div class="flex gap-1 items-center">
              <YazIcon name="person" :size="24" />
              <p class="font-raleway text-sm">
                {{ $t('roomInformation.sleeps') }} {{ room.bookingInformation.guestNumber }}
              </p>
            </div>

            <div class="flex gap-1 items-center">
              <YazIcon name="bed" :size="24" />
              <p
                v-for="(sleep, index) in room.bookingInformation.sleeps"
                class="font-raleway text-sm"
              >
                {{ $t(`roomInformation.${sleep}`) }}
                <span v-if="index !== room.bookingInformation.sleeps.length - 1">&</span>
              </p>
            </div>

            <div class="flex gap-1 items-center">
              <YazIcon name="bath" :size="24" />
              <p class="font-raleway text-sm">
                {{ $t('roomInformation.bathroom') }} {{ room.bookingInformation.bathroom }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap">
            <p class="font-raleway text-sm">
              {{ room.bookingInformation.size }}m²
            </p>
            <span class="mx-1">•</span>
            <p
              v-for="(feature, index) in room.bookingInformation.features"
              class="font-raleway text-sm"
            >
              {{ $t(`roomInformation.${feature}`) }}
              <span
                v-if="index !== room.bookingInformation.features.length - 1"
                class="mx-1"
              >•</span>
            </p>
          </div>
          <p class="text-sm font-raleway">
            {{ $t(room.description) }}
          </p>
        </div>
      </div>
    </div>

    <span class="block h-[0.5px] bg-primary my-4 w-[90%] mx-auto"></span>

    <div class="booking-card__footer flex flex-col px-4 pb-4">
      <p class="text-md font-raleway font-medium">
        {{ $t('allInclusive') }}
      </p>

      <div class="flex justify-end gap-4">
        <div class="flex flex-col items-end gap-2">
          <p class="font-raleway text-md font-bold">
            EUR {{ room.bookingInformation.price }}
          </p>

          <p class="font-raleway text-xs text-primary">
            {{ nightNumber }} {{ $t('nights') }}, {{ guestNumber }} {{ $t('guests') }}
          </p>
        </div>
        <YazButton :label="$t('selectRoom')"/>
      </div>
    </div>
  </div>
</template>
