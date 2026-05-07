<script setup lang="ts">
  import { computed } from 'vue';
  import { useTranslation } from 'i18next-vue';
  import { getMediaUrl } from '../../utils/media';
  import { ROOMS } from '../../enums/global';

  const { i18next } = useTranslation();
  const isTr = computed(() => i18next.language?.startsWith('tr'));

  const roomList = computed(() => [
    { id: '1', slug: 'zeus', name: 'Zeus', noteKey: 'home.rooms.zeusNote', image: 'oda_1/oda1-1-min.jpg' },
    { id: '2', slug: 'hera', name: 'Hera', noteKey: 'home.rooms.heraNote', image: 'oda_2/oda2-1-min.jpg' },
    { id: '3', slug: 'tenedos', name: 'Tenedos', noteKey: 'home.rooms.tenedosNote', image: 'oda_3/oda3-1-min.jpg' },
    { id: '4', slug: 'tenes', name: isTr.value ? 'Tenes' : 'Tenes', noteKey: 'home.rooms.tenesNote', image: 'oda_4/oda4-1-min.jpg' },
    { id: '5', slug: 'ilyada', name: isTr.value ? 'İlyada' : 'Ilyada', noteKey: 'home.rooms.ilyadaNote', image: 'oda_3/oda3-9-min.jpg' },
  ]);
</script>

<template>
  <div class="home-editorial bg-cream text-ink font-raleway font-light">
    <section class="home-editorial__hero px-6 md:px-16 pt-12 md:pt-20 pb-20 md:pb-32">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-end">
        <div>
          <div class="eyebrow mb-10 md:mb-12">— {{ $t('home.hero.eyebrow') }}</div>
          <h1 class="font-serif-display font-light leading-[0.95] tracking-tight m-0" style="font-size: clamp(56px, 8vw, 96px); letter-spacing: -0.02em;">
            <span class="block">{{ $t('home.hero.titleLine1') }}</span>
            <span class="block italic text-accent" style="padding-left: 18%;">{{ $t('home.hero.titleLine2') }}</span>
            <span class="block">{{ $t('home.hero.titleLine3') }}</span>
          </h1>
          <p class="mt-10 md:mt-14 max-w-[440px] text-[16px] leading-[1.6] opacity-80">
            {{ $t('home.hero.lede') }}
          </p>
          <div class="flex flex-wrap gap-4 mt-10">
            <router-link
              to="/booking"
              class="inline-block px-8 py-4 bg-ink text-cream rounded-full text-[12px] uppercase tracking-widest2 font-medium no-underline"
            >
              {{ $t('reserve') }}
            </router-link>
            <router-link
              to="/rooms"
              class="inline-block px-8 py-4 border border-ink rounded-full text-[12px] uppercase tracking-widest2 font-medium text-ink no-underline"
            >
              {{ $t('home.hero.exploreRooms') }} →
            </router-link>
          </div>
        </div>
        <div class="home-editorial__hero-image">
          <img
            :src="getMediaUrl('homepage-1-min.jpg')"
            :alt="$t('home.hero.heroImageAlt')"
            class="w-full h-[420px] md:h-[720px] object-cover rounded-sm block"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <div class="px-6 md:px-16 pb-20 md:pb-24 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-widest3 opacity-55">
      <span>{{ $t('home.meta.rooms') }}</span>
      <span class="opacity-40">·</span>
      <span>Check-in 14:00</span>
      <span class="opacity-40">·</span>
      <span>39.83° {{ isTr ? 'K' : 'N' }} · 26.04° {{ isTr ? 'D' : 'E' }}</span>
      <span class="hidden md:block flex-1 h-px bg-ink/10 mx-4"></span>
      <span>{{ $t('home.meta.season') }}</span>
    </div>

    <section class="home-editorial__spread px-6 md:px-16 pb-24 md:pb-36">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-start">
        <div class="md:col-span-5 md:sticky md:top-20">
          <div class="eyebrow mb-10">— 01 · {{ $t('home.house.label') }}</div>
          <h2 class="font-serif-display font-light leading-[1.05] m-0 whitespace-pre-line" style="font-size: clamp(36px, 4.5vw, 56px); letter-spacing: -0.01em;">
            {{ $t('home.house.title') }}
          </h2>
          <p class="mt-10 text-[15px] leading-[1.75] opacity-80">
            {{ $t('home.house.body') }}
          </p>
        </div>
        <div class="md:col-span-7 grid grid-cols-2 gap-3 md:gap-6">
          <img
            :src="getMediaUrl('homepage-2-min.jpg')"
            :alt="$t('home.house.imgCourtyardAlt')"
            class="w-full h-[300px] md:h-[480px] object-cover row-span-2"
            loading="lazy"
          />
          <img
            :src="getMediaUrl('homepage-4-min.jpg')"
            :alt="$t('home.house.imgInteriorAlt')"
            class="w-full h-[140px] md:h-[228px] object-cover"
            loading="lazy"
          />
          <img
            :src="getMediaUrl('homepage-5-min.jpg')"
            :alt="$t('home.house.imgDetailAlt')"
            class="w-full h-[140px] md:h-[228px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section class="home-editorial__quote px-6 md:px-16 pb-24 md:pb-36">
      <blockquote class="font-serif-display italic font-light m-0 max-w-[1100px] text-secondaryDark"
        style="font-size: clamp(36px, 5vw, 64px); line-height: 1.15; letter-spacing: -0.01em;">
        “{{ $t('home.pullQuote') }}”
      </blockquote>
    </section>

    <section class="home-editorial__rooms px-6 md:px-16 pb-24 md:pb-32 pt-16 md:pt-20 border-t border-ink/10">
      <div class="flex flex-col md:flex-row md:justify-between md:items-baseline mb-12 gap-3">
        <h3 class="font-serif-display font-light m-0" style="font-size: clamp(32px, 4vw, 48px); letter-spacing: -0.01em;">
          {{ $t('navigation.rooms') }}
        </h3>
        <span class="eyebrow">{{ $t('home.rooms.note') }}</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-4">
        <router-link
          v-for="(r, i) in roomList"
          :key="r.id"
          :to="`/room/${r.slug}`"
          class="group block no-underline text-ink"
        >
          <div class="overflow-hidden mb-4">
            <img
              :src="getMediaUrl(r.image)"
              :alt="r.name"
              class="w-full h-[260px] md:h-[320px] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="flex justify-between items-baseline">
            <span class="font-serif-display italic text-[22px]">{{ r.name }}</span>
            <span class="text-[10px] tracking-widest2 opacity-50">0{{ i + 1 }}</span>
          </div>
          <div class="text-[12px] opacity-60 mt-1">{{ $t(r.noteKey) }}</div>
        </router-link>
      </div>
    </section>

    <section class="home-editorial__experience relative h-[520px] md:h-[600px] overflow-hidden">
      <img
        :src="getMediaUrl('windmills-horizontal-hres-min.jpg')"
        :alt="$t('home.experience.imageAlt')"
        class="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0" style="background: linear-gradient(90deg, rgba(31,22,20,0.7) 0%, rgba(31,22,20,0.2) 60%);"></div>
      <div class="relative z-10 px-6 md:px-16 py-16 md:py-20 text-cream h-full flex flex-col justify-center max-w-[640px]">
        <div class="eyebrow text-accent !opacity-100 mb-6 md:mb-8">— {{ $t('home.experience.label') }}</div>
        <h3 class="font-serif-display font-light leading-[0.95] m-0 whitespace-pre-line" style="font-size: clamp(48px, 6vw, 80px); letter-spacing: -0.02em;">
          {{ $t('home.experience.title') }}
        </h3>
        <p class="text-[16px] leading-[1.6] opacity-90 mt-6 md:mt-8 max-w-[460px]">
          {{ $t('home.experience.body') }}
        </p>
        <router-link
          to="/experiences"
          class="self-start mt-8 px-8 py-4 bg-accent text-ink rounded-full text-[12px] uppercase tracking-widest2 font-medium no-underline"
        >
          {{ $t('home.experience.cta') }} →
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-editorial {
  scroll-snap-type: none;

  section {
    scroll-snap-align: none;
  }
}
</style>
