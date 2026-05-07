<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { ROOMS_V1 } from '../../data/rooms';
import HotelImage from '../atoms/HotelImage.vue';
import Eyebrow from '../atoms/Eyebrow.vue';

const { i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));
const lang = computed<'tr' | 'en'>(() => (isTr.value ? 'tr' : 'en'));
</script>

<template>
  <div class="rooms-editorial bg-cream text-ink font-raleway font-light">
    <section class="px-6 md:px-16 pt-16 md:pt-24 pb-16 md:pb-20">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-end">
        <h1
          class="md:col-span-7 font-display font-light leading-[0.92] tracking-display m-0"
          style="font-size: clamp(60px, 9vw, 144px); letter-spacing: -0.03em;"
        >
          <span class="block">{{ $t('roomsIndex.titleLine1') }}</span>
          <span class="block italic text-peach" style="padding-left: 8%;">{{ $t('roomsIndex.titleLine2') }}</span>
          <span class="block">{{ $t('roomsIndex.titleLine3') }}</span>
        </h1>
        <div class="md:col-span-5">
          <Eyebrow class="mb-6">{{ $t('roomsIndex.eyebrow') }}</Eyebrow>
          <p class="text-[16px] leading-[1.7] opacity-80 m-0">{{ $t('roomsIndex.lede') }}</p>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-24 md:pb-32">
      <router-link
        v-for="(r, i) in ROOMS_V1"
        :key="r.id"
        :to="`/room/${r.slug}`"
        class="rooms-row grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-12 md:py-16 border-t border-ink/10 no-underline text-ink"
        :class="i % 2 === 1 ? 'md:rooms-row--reverse' : ''"
      >
        <div :class="i % 2 === 1 ? 'md:order-2' : ''">
          <HotelImage
            :src="r.photos[0]"
            :alt="lang === 'tr' ? r.nameTr : r.nameEn"
            class="h-[320px] md:h-[480px]"
          />
        </div>
        <div :class="i % 2 === 1 ? 'md:order-1 md:pr-8' : 'md:pl-8'">
          <div class="flex justify-between items-baseline mb-6">
            <span class="text-[11px] tracking-widest3 opacity-50 font-mono">0{{ i + 1 }} / 05</span>
            <span class="text-[11px] tracking-widest3 opacity-55 uppercase font-semibold">
              {{ $t('roomsIndex.from') }}
              <strong class="font-bold text-peach ml-1">{{ r.price[lang] }}</strong>
            </span>
          </div>
          <h2
            class="font-display font-light m-0 mb-4"
            style="font-size: clamp(48px, 6vw, 96px); line-height: 0.95; letter-spacing: -0.02em;"
          >
            {{ lang === 'tr' ? r.nameTr : r.nameEn }}
          </h2>
          <div class="font-display italic text-[20px] md:text-[22px] text-muted mb-6">
            {{ lang === 'tr' ? r.subTr : r.subEn }}
          </div>
          <p class="text-[15px] leading-[1.7] opacity-80 mb-8 max-w-[480px]">
            {{ lang === 'tr' ? r.ledeTr : r.ledeEn }}
          </p>
          <div class="flex flex-wrap gap-x-8 gap-y-2 mb-8 text-[12px] tracking-nav uppercase opacity-70">
            <span>{{ r.capacity }} {{ $t('roomsIndex.capacity') }}</span>
            <span class="opacity-40">·</span>
            <span>{{ r.area }} {{ $t('roomsIndex.area') }}</span>
            <span class="opacity-40">·</span>
            <span>{{ r.view[lang] }}</span>
          </div>
          <span class="inline-block text-[12px] tracking-cta uppercase font-medium border-b border-ink pb-1">
            {{ $t('roomsIndex.detailLink') }} →
          </span>
        </div>
      </router-link>
    </section>
  </div>
</template>

<style scoped lang="scss">
.rooms-editorial {
  scroll-snap-type: none;
  section {
    scroll-snap-align: none;
  }
}
</style>
