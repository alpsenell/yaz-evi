<script setup lang="ts">
import { computed, ref } from "vue";
import { getMediaUrl } from '../../utils/media';
import Lightbox from "../organisms/Lightbox.vue";

type GalleryCategory = 'house' | 'rooms' | 'island';

interface GalleryItem {
  path: string;
  category: GalleryCategory;
  featured: boolean;
}

const GALLERY: GalleryItem[] = [
  { path: 'homepage-3-min.jpg', category: 'island', featured: true },
  { path: 'oda_1/oda1-1-min.jpg', category: 'rooms', featured: false },
  { path: 'home-gallery/gallery_left_1.jpg', category: 'house', featured: false },
  { path: 'homepage-1-min.jpg', category: 'house', featured: false },
  { path: 'oda_2/oda2-1-min.jpg', category: 'rooms', featured: true },
  { path: 'homepage-2-min.jpg', category: 'island', featured: false },
  { path: 'oda_3/oda3-1-min.jpg', category: 'rooms', featured: false },
  { path: 'homepage-4-min.jpg', category: 'island', featured: false },
  { path: 'oda_4/oda4-1-min.jpg', category: 'rooms', featured: false },
  { path: 'homepage-5-min.jpg', category: 'island', featured: true },
  { path: 'oda_1/oda1-3-min.jpg', category: 'rooms', featured: false },
  { path: 'home-gallery/gallery_right_1.jpg', category: 'house', featured: false },
  { path: 'homepage-6-min.jpg', category: 'house', featured: false },
  { path: 'oda_3/oda3-2-min.jpg', category: 'rooms', featured: false },
  { path: 'oda_2/oda2-2-min.jpg', category: 'rooms', featured: false },
  { path: 'home-gallery/gallery_left_2.jpg', category: 'house', featured: false },
];

const filters = [
  { key: 'all', label: 'v2.gallery.filterAll' },
  { key: 'house', label: 'v2.gallery.filterHouse' },
  { key: 'rooms', label: 'v2.gallery.filterRooms' },
  { key: 'island', label: 'v2.gallery.filterIsland' },
] as const;

const activeFilter = ref<string>('all');

const filtered = computed(() =>
  GALLERY.filter(item => activeFilter.value === 'all' || item.category === activeFilter.value)
);

const filteredUrls = computed(() => filtered.value.map(item => getMediaUrl(item.path)));

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const setFilter = (key: string) => {
  activeFilter.value = key;
};
</script>

<template>
  <main class="gallery page-fade bg-cream">
    <!-- Sub hero -->
    <div class="relative h-[420px] md:h-[560px] overflow-hidden">
      <img
        :src="getMediaUrl('homepage-2-min.jpg')"
        alt="Yaz Evi Bozcaada gallery"
        class="absolute inset-0 w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.42)] via-[rgba(16,32,40,0.15)] to-[rgba(16,32,40,0.5)]"></div>
      <div class="absolute left-0 right-0 top-[56%] -translate-y-1/2 text-center text-white px-6">
        <div class="eyebrow-light mb-5">{{ $t('v2.gallery.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[44px] md:text-[58px] lg:text-[78px] m-0">{{ $t('v2.gallery.title') }}</h1>
      </div>
    </div>

    <!-- Filter chips -->
    <div class="flex flex-wrap gap-3 justify-center px-6 md:px-14 pt-11 md:pt-[60px] pb-10">
      <button
        v-for="filter in filters"
        :key="filter.key"
        type="button"
        class="font-jost text-xs tracking-[0.2em] uppercase px-[22px] py-2.5 cursor-pointer border transition-all duration-200"
        :class="activeFilter === filter.key
          ? 'border-ink bg-ink text-parchment'
          : 'border-[#d8cdb4] bg-transparent text-slate hover:border-ink'"
        @click="setFilter(filter.key)"
      >
        {{ $t(filter.label) }}
      </button>
    </div>

    <!-- Mosaic grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] md:auto-rows-[240px] [grid-auto-flow:dense] gap-3.5 px-6 md:px-14 pb-[70px] md:pb-[110px]">
      <button
        v-for="(item, index) in filtered"
        :key="item.path"
        type="button"
        class="relative overflow-hidden cursor-pointer group bg-transparent border-none p-0"
        :class="item.featured ? 'md:col-span-2 md:row-span-2' : ''"
        :aria-label="`${$t('galleryModal.imageAlt')} ${index + 1}`"
        @click="openLightbox(index)"
      >
        <img
          :src="getMediaUrl(item.path)"
          :alt="`${$t('galleryModal.imageAlt')} ${index + 1}`"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        >
      </button>
    </div>

    <Lightbox
      :open="lightboxOpen"
      :images="filteredUrls"
      v-model:index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </main>
</template>
