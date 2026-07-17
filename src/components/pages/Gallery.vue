<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import i18next from "i18next";
import { getMediaUrl } from '../../utils/media';
import Lightbox from "../organisms/Lightbox.vue";

interface PlateDef {
  path: string;
  captionKey?: string;
  roomName?: string;
  roomSlug?: string;
  col: string;
  h: string;
  push?: string;
}

interface ChapterDef {
  key: 'house' | 'rooms' | 'island';
  num: string;
  dark?: boolean;
  quoteKey?: string;
  quoteByKey?: string;
  plates: PlateDef[];
}

const CHAPTERS: ChapterDef[] = [
  {
    key: 'house',
    num: 'I',
    quoteKey: 'v2.gallery.quoteHouse',
    quoteByKey: 'v2.gallery.quoteHouseBy',
    plates: [
      { path: 'homepage-1-min.jpg', captionKey: 'house1', col: '1 / span 7', h: '560px' },
      { path: 'home-gallery/gallery_left_1.jpg', captionKey: 'house2', col: '9 / span 4', h: '380px', push: '120px' },
      { path: 'home-gallery/gallery_left_2.jpg', captionKey: 'house3', col: '2 / span 4', h: '400px', push: '60px' },
      { path: 'homepage-6-min.jpg', captionKey: 'house4', col: '7 / span 6', h: '520px' },
    ],
  },
  {
    key: 'rooms',
    num: 'II',
    dark: true,
    plates: [
      { path: 'oda_1/oda1-1-min.jpg', roomName: 'Zeus', roomSlug: 'zeus', col: '1 / span 5', h: '460px' },
      { path: 'oda_2/oda2-1-min.jpg', roomName: 'Hera', roomSlug: 'hera', col: '7 / span 6', h: '560px', push: '100px' },
      { path: 'oda_3/oda3-1-min.jpg', roomName: 'Tenedos', roomSlug: 'tenedos', col: '2 / span 6', h: '480px', push: '80px' },
      { path: 'oda_4/oda4-1-min.jpg', roomName: 'Tenes', roomSlug: 'tenes', col: '9 / span 4', h: '380px' },
      { path: 'oda_1/oda1-3-min.jpg', roomName: 'Ilyada', roomSlug: 'ilyada', col: '4 / span 6', h: '500px', push: '60px' },
    ],
  },
  {
    key: 'island',
    num: 'III',
    quoteKey: 'v2.gallery.quoteIsland',
    quoteByKey: 'v2.gallery.quoteIslandBy',
    plates: [
      { path: 'homepage-3-min.jpg', captionKey: 'island1', col: '1 / span 6', h: '520px' },
      { path: 'homepage-2-min.jpg', captionKey: 'island2', col: '8 / span 5', h: '420px', push: '120px' },
      { path: 'homepage-4-min.jpg', captionKey: 'island3', col: '2 / span 5', h: '440px', push: '70px' },
      { path: 'homepage-5-min.jpg', captionKey: 'island4', col: '8 / span 5', h: '520px' },
    ],
  },
];

const lang = ref(i18next.language as string);
const onLanguageChanged = (l: string) => { lang.value = l; };
i18next.on('languageChanged', onLanguageChanged);
onBeforeUnmount(() => i18next.off('languageChanged', onLanguageChanged));

const lowerFirst = (s: string) => s.charAt(0).toLocaleLowerCase(lang.value) + s.slice(1);

const chapters = computed(() => {
  void lang.value;
  let n = 0;
  return CHAPTERS.map(chap => ({
    ...chap,
    title: i18next.t(`v2.gallery.chapters.${chap.key}`),
    sub: i18next.t(`v2.gallery.chapters.${chap.key}Sub`),
    quote: chap.quoteKey ? i18next.t(chap.quoteKey) : '',
    quoteBy: chap.quoteByKey ? i18next.t(chap.quoteByKey) : '',
    plates: chap.plates.map(pl => {
      const idx = n++;
      return {
        ...pl,
        idx,
        num: String(idx + 1).padStart(2, '0'),
        src: getMediaUrl(pl.path),
        caption: pl.roomSlug
          ? `${pl.roomName} — ${lowerFirst(i18next.t(`v2.roomTags.${pl.roomSlug}`))}`
          : i18next.t(`v2.gallery.captions.${pl.captionKey}`),
      };
    }),
  }));
});

const allPlates = computed(() => chapters.value.flatMap(chap => chap.plates));
const lightboxImages = computed(() => allPlates.value.map(pl => pl.src));
const lightboxCaptions = computed(() =>
  allPlates.value.map(pl => `${i18next.t('v2.gallery.plate')} ${pl.num} — ${pl.caption}`)
);

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};
</script>

<template>
  <main class="gallery page-fade bg-cream">
    <!-- ===== Desktop ===== -->
    <div class="hidden md:block">
      <!-- Hero -->
      <section class="mx-14 pt-[180px] pb-[90px] grid grid-cols-2 gap-[60px] items-end border-b border-solid border-ink">
        <div>
          <div class="font-jost text-xs tracking-[0.34em] uppercase text-azure mb-[26px]">
            {{ $t('v2.gallery.eyebrow') }} — {{ $t('v2.gallery.edition') }}
          </div>
          <h1
            class="serif-em font-serif font-light text-[min(118px,8.5vw)] leading-[0.94] tracking-[-0.01em] m-0 text-ink"
            v-html="$t('v2.gallery.title')"
          ></h1>
        </div>
        <div class="flex flex-col gap-6 pb-2.5">
          <p class="font-jost font-light text-base leading-[1.95] text-slate m-0 max-w-[420px]">{{ $t('v2.gallery.intro') }}</p>
          <div class="flex gap-9 font-jost text-[11px] tracking-[0.28em] uppercase text-stone">
            <span v-for="chap in chapters" :key="chap.key">{{ chap.num }} — {{ chap.title }}</span>
          </div>
        </div>
      </section>

      <!-- Chapters -->
      <section
        v-for="chap in chapters"
        :key="chap.key"
        class="px-14 pt-[110px] pb-10"
      >
        <div class="grid grid-cols-2 gap-[60px] items-baseline mb-[70px]">
          <h2 class="font-serif font-light text-[min(64px,5.5vw)] leading-none m-0 text-ink">
            <span class="text-[22px] text-gold align-super mr-[18px]">{{ chap.num }}</span>{{ chap.title }}
          </h2>
          <div class="font-jost text-xs tracking-[0.34em] uppercase text-azure justify-self-end">{{ chap.sub }}</div>
        </div>
        <div class="grid grid-cols-12 gap-5 items-start">
          <figure
            v-for="pl in chap.plates"
            :key="pl.path"
            class="m-0 group"
            :style="{ gridColumn: pl.col, paddingTop: pl.push ?? '0' }"
          >
            <button
              type="button"
              class="block w-full overflow-hidden cursor-pointer bg-transparent border-none p-0"
              :aria-label="pl.caption"
              v-track="`clickOnGalleryImage${pl.idx + 1}`"
              @click="openLightbox(pl.idx)"
            >
              <img
                :src="pl.src"
                :alt="pl.caption"
                loading="lazy"
                class="w-full object-cover block transition-transform duration-[600ms] group-hover:scale-[1.04]"
                :style="{ height: pl.h }"
              >
            </button>
            <figcaption class="flex justify-between gap-4 pt-3">
              <span class="font-serif italic font-light text-[17px] text-slate">{{ pl.caption }}</span>
              <span class="font-jost text-[10px] tracking-[0.26em] uppercase text-stone whitespace-nowrap pt-[5px]">{{ $t('v2.gallery.plate') }} {{ pl.num }}</span>
            </figcaption>
          </figure>
        </div>
        <blockquote v-if="chap.quote" class="mt-[110px] mb-[30px] mx-auto max-w-[760px] text-center">
          <p class="font-serif italic font-light text-[38px] leading-[1.35] m-0 mb-[22px] text-ink">{{ chap.quote }}</p>
          <cite class="not-italic font-jost text-[11px] tracking-[0.3em] uppercase text-gold">{{ chap.quoteBy }}</cite>
        </blockquote>
      </section>

      <!-- CTA -->
      <section class="mx-14 mt-20 border-t border-solid border-ink pt-[90px] pb-[120px] grid grid-cols-2 gap-[60px] items-center">
        <h2
          class="serif-em font-serif font-light text-[min(72px,6vw)] leading-[1.02] m-0 text-ink"
          v-html="$t('v2.gallery.ctaTitle')"
        ></h2>
        <div class="justify-self-end flex flex-col gap-7 items-start">
          <p class="font-jost font-light text-base leading-[1.95] text-slate m-0 max-w-[380px]">{{ $t('v2.gallery.ctaBody') }}</p>
          <router-link
            to="/booking"
            class="inline-block font-jost text-xs tracking-[0.28em] uppercase bg-ink text-parchment px-11 py-[17px] hover:bg-azure transition-colors"
            v-track="'clickOnGalleryBookYourStay'"
          >
            {{ $t('v2.stay') }}
          </router-link>
        </div>
      </section>
    </div>

    <!-- ===== Mobile ===== -->
    <div class="md:hidden overflow-hidden">
      <!-- Hero -->
      <section class="relative pt-[110px] px-5 pb-10">
        <div class="absolute -right-3.5 top-[88px] font-serif font-light text-[150px] leading-none text-sandLight select-none">01</div>
        <div class="relative">
          <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azure mb-[18px]">{{ $t('v2.gallery.eyebrow') }}</div>
          <h1
            class="serif-em font-serif font-light text-[56px] leading-[0.96] m-0 mb-5 text-ink"
            v-html="$t('v2.gallery.title')"
          ></h1>
          <p class="font-jost font-light text-sm leading-[1.9] text-slate m-0">{{ $t('v2.gallery.introMobile') }}</p>
        </div>
      </section>

      <!-- Chapter carousels -->
      <section
        v-for="chap in chapters"
        :key="chap.key"
        class="pt-9 pb-[26px]"
        :class="chap.dark ? 'bg-inkDeep' : 'bg-cream'"
      >
        <div class="flex justify-between items-baseline px-5 mb-[22px]">
          <h2
            class="font-serif font-light text-[38px] leading-none m-0"
            :class="chap.dark ? 'text-parchment' : 'text-ink'"
          >
            <span class="text-[15px] text-gold align-super mr-2.5">{{ chap.num }}</span>{{ chap.title }}
          </h2>
          <div
            class="font-jost text-[10px] tracking-[0.26em] uppercase"
            :class="chap.dark ? 'text-azureSoft' : 'text-stone'"
          >{{ chap.sub }}</div>
        </div>
        <div class="flex gap-3.5 overflow-x-auto px-5 pb-[18px] snap-x snap-mandatory [scrollbar-width:none]">
          <figure
            v-for="pl in chap.plates"
            :key="pl.path"
            class="m-0 flex-[0_0_78%] snap-center"
          >
            <button
              type="button"
              class="block w-full overflow-hidden cursor-pointer bg-transparent border-none p-0"
              :aria-label="pl.caption"
              v-track="`clickOnGalleryImage${pl.idx + 1}`"
              @click="openLightbox(pl.idx)"
            >
              <img
                :src="pl.src"
                :alt="pl.caption"
                loading="lazy"
                class="w-full h-[390px] object-cover block"
              >
            </button>
            <figcaption class="flex justify-between gap-3 pt-2.5">
              <span
                class="font-serif italic font-light text-[15px]"
                :class="chap.dark ? 'text-azureSoft' : 'text-slate'"
              >{{ pl.caption }}</span>
              <span
                class="font-jost text-[9px] tracking-[0.24em] uppercase whitespace-nowrap pt-1"
                :class="chap.dark ? 'text-azureSoft' : 'text-stone'"
              >{{ $t('v2.gallery.plateShort') }} {{ pl.num }}</span>
            </figcaption>
          </figure>
          <div class="flex-[0_0_12px]"></div>
        </div>
        <div
          class="px-5 pt-1 pb-3.5 font-jost text-[10px] tracking-[0.26em] uppercase"
          :class="chap.dark ? 'text-azureSoft' : 'text-stone'"
        >{{ $t('v2.gallery.swipe') }} →</div>
      </section>

      <!-- Quote -->
      <blockquote class="m-0 px-[30px] py-16 text-center bg-cream">
        <p class="font-serif italic font-light text-[25px] leading-[1.4] m-0 mb-3.5 text-ink">{{ $t('v2.gallery.quoteIsland') }}</p>
        <cite class="not-italic font-jost text-[10px] tracking-[0.26em] uppercase text-gold">{{ $t('v2.gallery.quoteIslandBy') }}</cite>
      </blockquote>

      <!-- CTA -->
      <section class="mx-5 border-t border-solid border-ink pt-12 pb-[60px] flex flex-col gap-5">
        <h2
          class="serif-em font-serif font-light text-[42px] leading-[1.02] m-0 text-ink"
          v-html="$t('v2.gallery.ctaTitle')"
        ></h2>
        <router-link
          to="/booking"
          class="block text-center font-jost text-xs tracking-[0.28em] uppercase bg-ink text-parchment p-[17px] hover:bg-azure transition-colors"
          v-track="'clickOnGalleryBookYourStay'"
        >
          {{ $t('v2.stay') }}
        </router-link>
      </section>
    </div>

    <Lightbox
      :open="lightboxOpen"
      :images="lightboxImages"
      :captions="lightboxCaptions"
      v-model:index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </main>
</template>

<style scoped>
.serif-em :deep(em) {
  color: #C9B58C;
  font-style: italic;
}
</style>
