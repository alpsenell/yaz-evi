<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from "vue";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/vue-splide";

import TransitionImage from "../atoms/TransitionImage.vue";
import YazModal from "../atoms/YazModal.vue";
import YazIcon from "../atoms/YazIcon.vue";

import { GALLERY_IMAGES } from "../../enums/global.ts";

const splideRef = ref<any>(null);
const galleryModal = ref(false);

const handleClick = async (image: string) => {
  const imageIndex = GALLERY_IMAGES.indexOf(image);

  if (imageIndex === -1) {
    return;
  }
  galleryModal.value = true;
  await nextTick();
  if (splideRef.value) {
    splideRef.value.go(imageIndex);
  }
}

const getImageUrl = (value: string) => {
  return new URL(`../../assets/media/${value}`, import.meta.url).href;
}

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (!galleryModal.value || !splideRef.value) return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      splideRef.value.go('<');
      break;
    case 'ArrowRight':
      event.preventDefault();
      splideRef.value.go('>');
      break;
    case 'Escape':
      event.preventDefault();
      galleryModal.value = false;
      break;
  }
};

// Add/remove keyboard event listeners when modal opens/closes
watch(galleryModal, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    // Focus the modal for better accessibility
    nextTick(() => {
      const modal = document.querySelector('.gallery-modal-content');
      if (modal instanceof HTMLElement) {
        modal.focus();
      }
    });
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }
});

// Cleanup on component unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
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
            class="relative overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out focus-within:outline focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2 cursor-pointer"
            @click="handleClick(image)"
            tabindex="0"
            @keydown.enter="handleClick(image)"
            @keydown.space.prevent="handleClick(image)"
            :aria-label="`${$t('galleryModal.imageAlt')} ${childIndex + 1}`"
            role="button"
          >
            <TransitionImage
              class="cursor-pointer"
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
            class="relative overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out focus-within:outline focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2 cursor-pointer"
            @click="handleClick(image)"
            tabindex="0"
            @keydown.enter="handleClick(image)"
            @keydown.space.prevent="handleClick(image)"
            :aria-label="`${$t('galleryModal.imageAlt')} ${childIndex + 1}`"
            role="button"
          >
            <TransitionImage
              class="cursor-pointer"
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
    <div 
      class="gallery-modal-content focus:outline-none"
      role="dialog"
      aria-label="Gallery image viewer"
      aria-describedby="gallery-instructions"
      tabindex="-1"
    >
      <!-- Screen reader instructions -->
      <div id="gallery-instructions" class="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
        {{ $t('galleryModal.instructions') }}
      </div>
      
      <Splide
        ref="splideRef"
        class="h-full !absolute top-0 left-0 w-full"
        :has-track="false"
        :options="{
          perPage: 1,
          type: 'loop',
          pagination: false,
          lazyLoad: 'nearby',
          keyboard: true
        }"
      >
        <SplideTrack class="h-full">
          <SplideSlide
            v-for="(image, index) in GALLERY_IMAGES"
            :key="`slide-${index}`"
            class="max-h-screen"
          >
            <img
              class="w-full h-full object-cover"
              :src="getImageUrl(image)"
              :alt="`${$t('galleryModal.imageAlt')} ${index + 1} ${$t('galleryModal.of')} ${GALLERY_IMAGES.length}`"
            />
          </SplideSlide>
        </SplideTrack>

        <div class="splide__arrows absolute bottom-4 right-4">
          <button 
            class="splide__arrow splide__arrow--prev relative focus:outline focus:outline-2 focus:outline-white focus:outline-offset-2"
            :aria-label="$t('galleryModal.previousImage')"
          >
            <YazIcon name="left" color="white"/>
          </button>
          <button 
            class="splide__arrow splide__arrow--next relative focus:outline focus:outline-2 focus:outline-white focus:outline-offset-2"
            :aria-label="$t('galleryModal.nextImage')"
          >
            <YazIcon name="right" color="white"/>
          </button>
        </div>
      </Splide>
    </div>
  </YazModal>
</template>

