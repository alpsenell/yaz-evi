<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ROOMS } from '../../enums/global';
import { getMediaUrl } from '../../utils/media';

const router = useRouter();

const guests = ref(2);
const guestsOpen = ref(false);

const goBooking = () => {
  router.push({ path: '/booking', query: { guests: String(guests.value) } });
};

const homeExperiences = [
  {
    num: '01',
    eyebrow: 'v2.home.exp1Eyebrow',
    title: 'v2.home.exp1Title',
    body: 'v2.home.exp1Body',
    image: 'homepage-6-min.jpg',
    url: '/experiences',
    reverse: false,
  },
  {
    num: '02',
    eyebrow: 'v2.home.exp2Eyebrow',
    title: 'v2.home.exp2Title',
    body: 'v2.home.exp2Body',
    image: 'homepage-1-min.jpg',
    url: '/rooms',
    reverse: true,
  },
  {
    num: '03',
    eyebrow: 'v2.home.exp3Eyebrow',
    title: 'v2.home.exp3Title',
    body: 'v2.home.exp3Body',
    image: 'homepage-2-min.jpg',
    url: '/about',
    reverse: false,
  },
];

const moments = [
  'home-gallery/gallery_left_1.jpg',
  'oda_1/oda1-3-min.jpg',
  'homepage-4-min.jpg',
  'oda_2/oda2-2-min.jpg',
  'homepage-5-min.jpg',
  'oda_3/oda3-2-min.jpg',
];
</script>

<template>
  <main class="home page-fade bg-cream">
    <!-- Hero -->
    <div class="relative h-[620px] md:h-[900px] overflow-hidden">
      <img
        :src="getMediaUrl('homepage-3-min.jpg')"
        alt="Yaz Evi Bozcaada"
        class="absolute inset-0 w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.42)] via-[rgba(16,32,40,0.05)] to-[rgba(16,32,40,0.5)]"></div>
      <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-white px-6">
        <div class="eyebrow-light mb-5 md:mb-7">{{ $t('v2.hero.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[46px] md:text-[64px] lg:text-[92px] leading-[1.02] m-0">
          {{ $t('v2.hero.title') }}
        </h1>
        <div class="font-serif italic font-light text-[22px] md:text-[30px] opacity-90 mt-3">
          {{ $t('v2.hero.sub') }}
        </div>
      </div>
    </div>

    <!-- Reservation bar -->
    <div class="relative z-[3] max-w-[1120px] mx-4 lg:mx-auto -mt-[72px] bg-cream shadow-[0_30px_60px_rgba(16,32,40,0.18)] grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1.1fr]">
      <button
        type="button"
        class="text-left p-6 md:p-7 border-b md:border-b-0 md:border-r border-sand cursor-pointer bg-transparent"
        @click="goBooking"
      >
        <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azure mb-3">{{ $t('v2.checkIn') }}</div>
        <div class="font-serif text-2xl text-ink">{{ $t('v2.selectDate') }}</div>
      </button>
      <button
        type="button"
        class="text-left p-6 md:p-7 border-b md:border-b-0 md:border-r border-sand cursor-pointer bg-transparent"
        @click="goBooking"
      >
        <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azure mb-3">{{ $t('v2.checkOut') }}</div>
        <div class="font-serif text-2xl text-ink">{{ $t('v2.selectDate') }}</div>
      </button>
      <div class="relative">
        <button
          type="button"
          class="w-full text-left p-6 md:p-7 border-b md:border-b-0 md:border-r border-sand cursor-pointer bg-transparent"
          :class="{ 'bg-[#F0E8D9]': guestsOpen }"
          @click="guestsOpen = !guestsOpen"
        >
          <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azure mb-3">{{ $t('v2.guests') }}</div>
          <div class="font-serif text-2xl text-ink">{{ guests }} {{ $t('v2.guests') }}</div>
        </button>
        <div
          v-if="guestsOpen"
          class="absolute top-full left-0 right-0 md:left-auto md:min-w-[320px] bg-white shadow-[0_34px_70px_rgba(16,32,40,0.22)] p-7 z-30 mt-1"
        >
          <div class="flex items-center justify-between py-3">
            <div>
              <div class="font-jost text-sm text-ink">{{ $t('v2.adults') }}</div>
              <div class="font-jost text-xs text-stone">{{ $t('v2.adultsAge') }}</div>
            </div>
            <div class="flex items-center gap-4">
              <button
                type="button"
                class="w-9 h-9 border border-[#cfc4ac] rounded-full flex items-center justify-center text-ink cursor-pointer text-lg bg-transparent"
                @click="guests = Math.max(1, guests - 1)"
              >–</button>
              <span class="font-serif text-[22px] w-4 text-center">{{ guests }}</span>
              <button
                type="button"
                class="w-9 h-9 border border-[#cfc4ac] rounded-full flex items-center justify-center text-ink cursor-pointer text-lg bg-transparent"
                @click="guests = Math.min(6, guests + 1)"
              >+</button>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button
              type="button"
              class="font-jost text-xs tracking-[0.28em] uppercase bg-ink text-parchment px-8 py-3 cursor-pointer border-none"
              @click="guestsOpen = false"
            >{{ $t('v2.done') }}</button>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="bg-ink text-parchment flex items-center justify-center p-5 md:p-6 cursor-pointer border-none hover:bg-azure transition-colors"
        @click="goBooking"
      >
        <span class="font-jost text-xs tracking-[0.3em] uppercase">{{ $t('v2.book') }}</span>
      </button>
    </div>

    <!-- Intro -->
    <div class="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-12 md:gap-20 items-center px-6 md:px-14 py-20 md:py-[120px]">
      <div>
        <div class="eyebrow mb-5">{{ $t('v2.home.islandEyebrow') }}</div>
        <h2
          class="font-serif font-light text-[40px] md:text-[56px] leading-[1.08] text-ink mt-0 mb-6"
          v-html="$t('v2.home.islandTitle')"
        ></h2>
        <p class="body-p max-w-[460px] mb-6">{{ $t('v2.home.islandBody') }}</p>
        <router-link to="/about" class="link-underline">{{ $t('v2.explore') }}</router-link>
      </div>
      <div class="relative flex flex-col h-[480px] md:h-[600px]">
        <div class="relative w-[70%] h-[64%] self-end">
          <img :src="getMediaUrl('homepage-4-min.jpg')" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
        </div>
        <div class="relative w-[56%] h-[52%] -mt-[22%] border-[10px] border-cream">
          <img :src="getMediaUrl('homepage-5-min.jpg')" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
        </div>
      </div>
    </div>

    <!-- Rooms preview -->
    <div class="px-6 md:px-14 pb-20 md:pb-[110px]">
      <div class="text-center mb-11 md:mb-14">
        <div class="eyebrow mb-5">{{ $t('v2.home.roomsEyebrow') }}</div>
        <h2 class="font-serif font-light text-[40px] md:text-[56px] leading-[1.08] text-ink m-0">{{ $t('v2.home.roomsTitle') }}</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-[22px]">
        <router-link
          v-for="room in ROOMS"
          :key="room.slug"
          :to="`/room/${room.slug}`"
          class="block cursor-pointer group"
        >
          <div class="relative h-[260px] lg:h-[380px] mb-3.5 overflow-hidden">
            <img
              :src="getMediaUrl(room.image)"
              :alt="room.name"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            >
          </div>
          <div class="flex justify-between items-baseline">
            <span class="font-serif text-2xl text-ink capitalize">{{ room.name }}</span>
            <span class="font-jost text-[11px] tracking-[0.16em] text-stone">{{ room.bookingInformation.size }} m²</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Experiences (numbered) -->
    <div class="px-6 md:px-14">
      <div class="text-center mb-11 md:mb-14">
        <div class="eyebrow mb-5">{{ $t('v2.home.expEyebrow') }}</div>
        <h2 class="font-serif font-light text-[40px] md:text-[56px] leading-[1.08] text-ink m-0">{{ $t('v2.home.expTitle') }}</h2>
      </div>
      <div
        v-for="exp in homeExperiences"
        :key="exp.num"
        class="grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-[76px] items-center mb-[70px] md:mb-[110px]"
      >
        <div
          class="relative h-[360px] md:h-[560px] overflow-hidden order-1"
          :class="exp.reverse ? 'md:order-2' : ''"
        >
          <img :src="getMediaUrl(exp.image)" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
        </div>
        <div class="order-2" :class="exp.reverse ? 'md:order-1' : ''">
          <div class="font-serif text-[40px] text-gold leading-none mb-4">{{ exp.num }}</div>
          <div class="eyebrow mb-5">{{ $t(exp.eyebrow) }}</div>
          <h3 class="font-serif font-light text-[32px] md:text-[44px] leading-[1.1] text-ink mt-0 mb-5">{{ $t(exp.title) }}</h3>
          <p class="body-p max-w-[460px] mb-6">{{ $t(exp.body) }}</p>
          <router-link :to="exp.url" class="link-underline">{{ $t('v2.explore') }}</router-link>
        </div>
      </div>
    </div>

    <!-- Dining full-bleed -->
    <div class="relative h-[520px] md:h-[640px] overflow-hidden">
      <img :src="getMediaUrl('homepage-2-min.jpg')" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-r from-[rgba(16,32,40,0.62)] to-[rgba(16,32,40,0.08)]"></div>
      <div class="absolute left-6 right-6 bottom-11 md:left-16 md:right-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 text-white max-w-[520px]">
        <div class="font-jost text-xs tracking-[0.34em] uppercase text-white/85 mb-5">{{ $t('v2.home.diningEyebrow') }}</div>
        <h2 class="font-serif font-light text-[40px] md:text-[56px] leading-[1.06] mt-0 mb-5">{{ $t('v2.home.diningTitle') }}</h2>
        <p class="font-jost font-light text-base leading-[1.9] text-white/90 max-w-[420px] mt-0 mb-7">{{ $t('v2.home.diningBody') }}</p>
        <router-link to="/experiences" class="link-underline-light">{{ $t('v2.explore') }}</router-link>
      </div>
    </div>

    <!-- Quote -->
    <div class="text-center px-6 md:px-14 py-[90px] md:py-[140px] max-w-[900px] mx-auto">
      <div class="font-serif text-[54px] text-gold leading-none">“</div>
      <p class="font-serif font-light italic text-[24px] md:text-[30px] leading-[1.5] text-ink mt-2.5 mb-6">
        {{ $t('v2.home.quote') }}
      </p>
      <div class="font-jost text-xs tracking-[0.28em] uppercase text-azure">{{ $t('v2.home.quoteAuthor') }}</div>
    </div>

    <!-- Moments -->
    <div class="px-6 md:px-14 pb-20 md:pb-[110px]">
      <div class="flex items-end justify-between mb-8">
        <h2 class="font-serif font-light text-[32px] md:text-[44px] text-ink m-0">{{ $t('v2.home.momentsTitle') }}</h2>
        <a
          href="https://www.instagram.com/yazevibozcaada_/"
          target="_blank"
          rel="noopener noreferrer"
          class="link-underline-azure"
        >@yazevibozcaada_</a>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3.5">
        <router-link
          v-for="(moment, index) in moments"
          :key="index"
          to="/gallery"
          class="relative aspect-square overflow-hidden cursor-pointer group"
        >
          <img :src="getMediaUrl(moment)" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </router-link>
      </div>
    </div>

    <!-- Ink statement -->
    <div class="bg-ink text-parchment text-center px-6 md:px-14 py-[90px] md:py-[150px]">
      <div class="eyebrow-ink mb-7">{{ $t('v2.home.inkEyebrow') }}</div>
      <h2
        class="font-serif font-light text-[44px] md:text-[70px] leading-[1.12] m-0"
        v-html="$t('v2.home.inkTitle')"
      ></h2>
      <div class="font-serif italic text-[22px] md:text-[30px] text-azureSoft mt-4">{{ $t('v2.home.inkSub') }}</div>
      <router-link to="/booking" class="btn-outline-light mt-11">{{ $t('v2.stay') }}</router-link>
    </div>
  </main>
</template>
