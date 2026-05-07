<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted, watch } from 'vue';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import { useTranslation } from 'i18next-vue';
import { GALLERY_IMAGES } from '../../enums/global.ts';
import HotelImage from '../atoms/HotelImage.vue';
import Eyebrow from '../atoms/Eyebrow.vue';
import YazModal from '../atoms/YazModal.vue';
import YazIcon from '../atoms/YazIcon.vue';
import { getMediaUrl } from '../../utils/media';

const splideRef = ref<any>(null);
const galleryModal = ref(false);
const { i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));

const handleClick = async (image: string) => {
  const i = GALLERY_IMAGES.indexOf(image);
  if (i === -1) return;
  galleryModal.value = true;
  await nextTick();
  splideRef.value?.go(i);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!galleryModal.value || !splideRef.value) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); splideRef.value.go('<'); }
  if (event.key === 'ArrowRight') { event.preventDefault(); splideRef.value.go('>'); }
  if (event.key === 'Escape') { event.preventDefault(); galleryModal.value = false; }
};

watch(galleryModal, (open) => {
  if (open) {
    document.addEventListener('keydown', handleKeyDown);
    nextTick(() => {
      const m = document.querySelector('.gallery-modal-content');
      if (m instanceof HTMLElement) m.focus();
    });
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => document.removeEventListener('keydown', handleKeyDown));
</script>

<template>
  <div class="gallery-editorial bg-cream text-ink font-raleway font-light">
    <section class="px-6 md:px-16 pt-16 md:pt-24 pb-12 md:pb-20">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-end">
        <h1
          class="md:col-span-7 font-display font-light leading-[0.9] m-0"
          style="font-size: clamp(56px, 10vw, 144px); letter-spacing: -0.03em;"
        >
          <span class="block">{{ $t('galleryPage.titleLine1') }}</span>
          <span class="block italic text-peach" style="padding-left: 12%;">{{ $t('galleryPage.titleLine2') }}</span>
        </h1>
        <div class="md:col-span-5">
          <Eyebrow class="mb-6">{{ $t('galleryPage.eyebrow') }}</Eyebrow>
          <p class="text-[16px] leading-[1.65] opacity-80 m-0 mb-8">{{ $t('galleryPage.lede') }}</p>
          <div class="flex justify-between items-baseline border-t border-ink/20 pt-4">
            <span class="text-[11px] tracking-widest3 uppercase opacity-55">{{ $t('galleryPage.countLabel') }}</span>
            <span class="font-display italic text-[28px] md:text-[32px]">{{ GALLERY_IMAGES.length }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-16 md:pb-20">
      <Eyebrow class="mb-8">01 — {{ $t('galleryPage.house') }}</Eyebrow>
      <div class="cursor-pointer mb-4" @click="handleClick('homepage-3-min.jpg')">
        <HotelImage src="homepage-3-min.jpg" alt="house · stone" class="h-[420px] md:h-[700px]" eager />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div class="cursor-pointer" @click="handleClick('homepage-1-min.jpg')">
          <HotelImage src="homepage-1-min.jpg" alt="house" class="h-[240px] md:h-[320px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('homepage-2-min.jpg')">
          <HotelImage src="homepage-2-min.jpg" alt="courtyard" class="h-[240px] md:h-[320px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('homepage-4-min.jpg')">
          <HotelImage src="homepage-4-min.jpg" alt="interior" class="h-[240px] md:h-[320px]" />
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-16 md:pb-20">
      <Eyebrow class="mb-8">02 — {{ $t('galleryPage.rooms') }}</Eyebrow>
      <div class="gallery-rooms grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="cursor-pointer md:col-span-2 md:row-span-2" @click="handleClick('oda_1/oda1-1-min.jpg')">
          <HotelImage src="oda_1/oda1-1-min.jpg" alt="zeus" class="h-full min-h-[240px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('oda_2/oda2-1-min.jpg')">
          <HotelImage src="oda_2/oda2-1-min.jpg" alt="hera" class="h-[240px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('oda_3/oda3-1-min.jpg')">
          <HotelImage src="oda_3/oda3-1-min.jpg" alt="tenedos" class="h-[240px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('oda_4/oda4-1-min.jpg')">
          <HotelImage src="oda_4/oda4-1-min.jpg" alt="tenes" class="h-[240px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('oda_1/oda1-3-min.jpg')">
          <HotelImage src="oda_1/oda1-3-min.jpg" alt="zeus detail" class="h-[240px]" />
        </div>
        <div class="cursor-pointer md:col-span-2" @click="handleClick('oda_2/oda2-3-min.jpg')">
          <HotelImage src="oda_2/oda2-3-min.jpg" alt="hera detail" class="h-[240px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('oda_3/oda3-4-min.jpg')">
          <HotelImage src="oda_3/oda3-4-min.jpg" alt="tenedos detail" class="h-[240px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('oda_4/oda4-3-min.jpg')">
          <HotelImage src="oda_4/oda4-3-min.jpg" alt="tenes detail" class="h-[240px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('oda_2/wcb-1-min.jpg')">
          <HotelImage src="oda_2/wcb-1-min.jpg" alt="bath" class="h-[240px]" />
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-24 md:pb-32">
      <Eyebrow class="mb-8">03 — {{ $t('galleryPage.island') }}</Eyebrow>
      <div class="relative mb-4 cursor-pointer" @click="handleClick('windmills-horizontal-hres-min.jpg')">
        <HotelImage src="windmills-horizontal-hres-min.jpg" alt="windmills · horizon" class="h-[400px] md:h-[600px]" />
        <div
          class="absolute left-4 md:left-8 bottom-4 md:bottom-8 px-4 md:px-6 py-3 md:py-4 font-display italic text-[18px] md:text-[24px]"
          style="background: rgba(245,239,228,0.92);"
        >
          {{ isTr ? 'Yel değirmenleri, gün batımı' : 'The windmills at sunset' }}
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
        <div class="cursor-pointer" @click="handleClick('windmills-vertical.webp')">
          <HotelImage src="windmills-vertical.webp" alt="windmills · vertical" class="h-[360px] md:h-[520px]" />
        </div>
        <div class="cursor-pointer" @click="handleClick('experiences-1.jpg')">
          <HotelImage src="experiences-1.jpg" alt="experiences" class="h-[360px] md:h-[520px]" />
        </div>
      </div>
    </section>

    <YazModal :status="galleryModal" @close="galleryModal = false">
      <div
        class="gallery-modal-content focus:outline-none"
        role="dialog"
        :aria-label="$t('galleryModal.imageAlt')"
        aria-describedby="gallery-instructions"
        tabindex="-1"
      >
        <div id="gallery-instructions" class="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
          {{ $t('galleryModal.instructions') }}
        </div>
        <Splide
          ref="splideRef"
          class="h-full !absolute top-0 left-0 w-full"
          :has-track="false"
          :options="{ perPage: 1, type: 'loop', pagination: false, lazyLoad: 'nearby', keyboard: true }"
        >
          <SplideTrack class="h-full">
            <SplideSlide v-for="(image, index) in GALLERY_IMAGES" :key="`slide-${index}`" class="max-h-screen">
              <img
                class="w-full h-full object-cover"
                :src="getMediaUrl(image)"
                :alt="`${$t('galleryModal.imageAlt')} ${index + 1} ${$t('galleryModal.of')} ${GALLERY_IMAGES.length}`"
              />
            </SplideSlide>
          </SplideTrack>
          <div class="splide__arrows absolute bottom-4 right-4">
            <button class="splide__arrow splide__arrow--prev relative" :aria-label="$t('galleryModal.previousImage')">
              <YazIcon name="left" color="white" />
            </button>
            <button class="splide__arrow splide__arrow--next relative" :aria-label="$t('galleryModal.nextImage')">
              <YazIcon name="right" color="white" />
            </button>
          </div>
        </Splide>
      </div>
    </YazModal>
  </div>
</template>

<style scoped lang="scss">
.gallery-editorial {
  scroll-snap-type: none;
  section {
    scroll-snap-align: none;
  }
}
.gallery-rooms {
  grid-auto-rows: 240px;
}
</style>
