<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import HotelImage from '../atoms/HotelImage.vue';
import Eyebrow from '../atoms/Eyebrow.vue';

const { i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));

const items = computed(() => {
  if (isTr.value) {
    return [
      { num: '01', h: 'Şarap tadımı', body: "Bozcaada'nın yedi bağında bir akşam. Çorum, Vasilaki, Kuntra üzümleriyle, ada gastronomisinin küçük tabaklarıyla.", time: '3 sa', dist: '1–4 km', img: 'experiences-1.jpg' },
      { num: '02', h: 'Yel değirmenleri', body: 'Adanın kuzeydoğusundaki yel değirmenleri, gün batımının en iyi izlendiği nokta. Yürüyerek 25 dk, bisikletle 10.', time: '2 sa', dist: '2.5 km', img: 'windmills-horizontal-hres-min.jpg' },
      { num: '03', h: 'Ayazma sahili', body: 'Çamlarla çevrili, sığ ve sakin. Sabah erken gidin — öğleden sonra rüzgâr çıkar.', time: 'Tüm gün', dist: '8 km', img: 'homepage-6-min.jpg' },
      { num: '04', h: 'Eski liman akşamı', body: 'Akşam üstü kalenin gölgesinde, balıkla başlayan, rakı ile süren bir masa. Rezervasyon yardımı evden.', time: 'Açık uçlu', dist: '0.4 km', img: 'homepage-4-min.jpg' },
    ];
  }
  return [
    { num: '01', h: 'Wine tasting', body: "An evening among Bozcaada's seven vineyards. Çorum, Vasilaki, Kuntra grapes, with small plates of island gastronomy.", time: '3 hr', dist: '1–4 km', img: 'experiences-1.jpg' },
    { num: '02', h: 'The windmills', body: 'The windmills on the northeast of the island — the best place to watch the sunset. 25 min on foot, 10 by bike.', time: '2 hr', dist: '2.5 km', img: 'windmills-horizontal-hres-min.jpg' },
    { num: '03', h: 'Ayazma beach', body: 'Surrounded by pine, shallow and calm. Go early — the wind picks up in the afternoon.', time: 'All day', dist: '8 km', img: 'homepage-6-min.jpg' },
    { num: '04', h: 'An evening at the old harbor', body: 'In the shadow of the castle: a table that begins with fish and continues with rakı. We help with the reservation.', time: 'Open-ended', dist: '0.4 km', img: 'homepage-4-min.jpg' },
  ];
});

const note = computed(() =>
  isTr.value
    ? 'Tüm deneyimler için ev tarafından yardım sağlanır. Önceden haber verin, biz ayarlayalım.'
    : "All experiences are arranged with help from the house. Tell us in advance and we'll set it up."
);
</script>

<template>
  <div class="experiences-editorial bg-cream text-ink font-raleway font-light">
    <section class="px-6 md:px-16 pt-16 md:pt-24 pb-12 md:pb-20">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-end">
        <h1
          class="md:col-span-7 font-display font-light leading-[0.92] m-0"
          style="font-size: clamp(60px, 10vw, 144px); letter-spacing: -0.03em;"
        >
          <span class="block">{{ $t('experiencesPage.titleLine1') }}</span>
          <span class="block italic text-peach" style="padding-left: 10%;">{{ $t('experiencesPage.titleLine2') }}</span>
          <span class="block">{{ $t('experiencesPage.titleLine3') }}</span>
        </h1>
        <div class="md:col-span-5">
          <Eyebrow class="mb-6">{{ $t('experiencesPage.eyebrow') }}</Eyebrow>
          <p class="text-[16px] leading-[1.7] opacity-80 m-0 mb-6">{{ $t('experiencesPage.lede') }}</p>
          <div class="flex justify-between items-baseline border-t border-ink/20 pt-4 mt-6">
            <span class="text-[11px] tracking-widest3 uppercase opacity-55">{{ $t('experiencesPage.seasonLabel') }}</span>
            <span class="font-display italic text-[20px] md:text-[22px]">{{ $t('experiencesPage.seasonNote') }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-12 md:pb-20">
      <div
        v-for="(it, i) in items"
        :key="it.num"
        class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 py-12 md:py-16 border-t border-ink/10 items-center"
      >
        <div :class="i % 2 === 1 ? 'md:order-2' : ''">
          <HotelImage :src="it.img" :alt="it.h" class="h-[320px] md:h-[520px]" />
        </div>
        <div :class="i % 2 === 1 ? 'md:order-1 md:pr-8' : 'md:pl-8'">
          <div class="flex gap-6 items-baseline mb-6">
            <span class="font-display italic text-peach" style="font-size: clamp(22px, 2.5vw, 28px);">{{ it.num }}</span>
            <span class="flex-1 h-px bg-ink/20"></span>
          </div>
          <h2
            class="font-display font-light m-0 mb-8"
            style="font-size: clamp(40px, 5.5vw, 72px); line-height: 0.95; letter-spacing: -0.02em;"
          >
            {{ it.h }}
          </h2>
          <p class="text-[16px] leading-[1.7] opacity-85 m-0 mb-8 max-w-[460px]">{{ it.body }}</p>
          <div class="flex gap-12">
            <div>
              <div class="text-[12px] tracking-nav uppercase opacity-50 mb-2">{{ isTr ? 'Süre' : 'Time' }}</div>
              <div class="font-display italic text-[20px] md:text-[22px]">{{ it.time }}</div>
            </div>
            <div>
              <div class="text-[12px] tracking-nav uppercase opacity-50 mb-2">{{ isTr ? 'Mesafe' : 'Distance' }}</div>
              <div class="font-display italic text-[20px] md:text-[22px]">{{ it.dist }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-24 md:pb-32">
      <div
        class="bg-muted text-cream rounded-[4px] font-display italic font-light"
        style="padding: clamp(32px, 5vw, 48px) clamp(24px, 6vw, 64px); font-size: clamp(22px, 2.6vw, 32px); line-height: 1.4; letter-spacing: -0.005em;"
      >
        {{ note }}
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.experiences-editorial {
  scroll-snap-type: none;
  section {
    scroll-snap-align: none;
  }
}
</style>
