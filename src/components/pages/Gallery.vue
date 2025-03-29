<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/vue-splide";

import TransitionImage from "../atoms/TransitionImage.vue";
import YazModal from "../atoms/YazModal.vue";
import YazIcon from "../atoms/YazIcon.vue";

import { GALLERY_IMAGES } from "../../enums/global.ts";

const splideRef = ref(null);
const galleryModal = ref(false);

const handleClick = async (image) => {
  const imageIndex = GALLERY_IMAGES.indexOf(image);

  if (imageIndex === -1) {
    return;
  }
  galleryModal.value = true;
  await nextTick();
  if (splideRef) {
    splideRef.value.go(imageIndex);
  }
}
const getImageUrl = (value) => {
  return new URL(`../../assets/media/${value}`, import.meta.url)
}
</script>

<template>
  <section class="p-4 pt-24">
    <h1 class="invisible">{{ $t('gallery') }}</h1>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="index in 4"
        class="hidden md:flex flex-col gap-4 overflow-hidden"
      >
        <template
          v-for="(image, childIndex) in GALLERY_IMAGES"
          :key="`image-${childIndex}`"
        >
          <div
            v-if="(childIndex + 1) % 4 === (index % 4)"
            class="relative overflow-hidden"
            @click="handleClick(image)"
          >
            <TransitionImage
              class="hover:scale-110 cursor-pointer transition-transform"
              :image="image"
            />
          </div>
        </template>
      </div>

      <div
        v-for="index in 2"
        class="flex md:hidden flex-col gap-2"
      >
        <template
          v-for="(image, childIndex) in GALLERY_IMAGES"
          :key="`image-${childIndex}`"
        >
          <div
            v-if="(childIndex + 1) % 2 === (index % 2)"
            class="relative overflow-hidden"
            @click="handleClick(image)"
          >
            <TransitionImage
              :image="image"
            />
          </div>
        </template>
      </div>
    </div>
  </section>

  <YazModal
    :status="galleryModal"
    @close="galleryModal = false"
  >
    <Splide
      ref="splideRef"
      class="h-full !absolute top-0 left-0 w-full"
      :has-track="false"
      :options="{
        perPage: 1,
        type: 'loop',
        pagination: false,
        lazyLoad: 'nearby'
      }"
    >
      <SplideTrack class="h-full">
        <SplideSlide
          v-for="(image, index) in GALLERY_IMAGES"
          class="max-h-screen"
        >
          <img
            class="w-full h-full object-cover"
            :src="getImageUrl(image)"
            :alt="`Image of ${index + 1}`"
          />
        </SplideSlide>
      </SplideTrack>

      <div class="splide__arrows absolute bottom-4 right-4">
        <button class="splide__arrow splide__arrow--prev relative">
          <YazIcon name="left" color="white"/>
        </button>
        <button class="splide__arrow splide__arrow--next relative">
          <YazIcon name="right" color="white"/>
        </button>
      </div>
    </Splide>
  </YazModal>
</template>

