<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import HotelImage from '../atoms/HotelImage.vue';
import Eyebrow from '../atoms/Eyebrow.vue';

const { i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));

const chapters = computed(() => {
  if (isTr.value) {
    return [
      { num: 'I', title: 'Ev', body: "1890'larda örülmüş duvarlar, doğal kireç sıvayla yenilendi. Ahşap kirişler, hatıl taşları, demir kapı kolları aslına sadık kalınarak korundu. Onarılamayan her parça, adada kalan ustalarla yeniden üretildi." },
      { num: 'II', title: 'Sahipler', body: "Aile, evi 2019'da bir miras olarak devraldı. Bozcaada'da büyümüş bir kuşağın üçüncüsü olarak, evin sıvalarındaki tuzu, taşlarındaki rüzgârı, sokakların ışığını biliyorlar. Yaz Evi, bu hafızanın paylaşıldığı bir ev." },
      { num: 'III', title: 'Süreç', body: 'Üç yıl, on iki usta, dört kış. Restorasyon yavaş bir iş — özellikle kış aylarında ada kapandığında, dönen tek ses dalgaların sesidir. Bu yavaşlık, evin kendisine sindi.' },
      { num: 'IV', title: 'Bugün', body: 'Beş oda, bir avlu, küçük bir kütüphane, bir mutfak. Evin bütün ölçüsü, bir misafirin sabah kahvaltısında yalnız hissetmemesi üzerine kuruldu.' },
    ];
  }
  return [
    { num: 'I', title: 'The House', body: "Walls laid in the 1890s, restored in natural lime plaster. Wooden beams, lintel stones, iron door handles preserved faithfully. What couldn't be repaired was reproduced by the masters still living on the island." },
    { num: 'II', title: 'The Owners', body: 'The family inherited the house in 2019. As the third generation of a family raised on Bozcaada, they know the salt in its plaster, the wind in its stones, the light of its streets. Yaz Evi is a house where this memory is shared.' },
    { num: 'III', title: 'The Process', body: 'Three years, twelve craftsmen, four winters. Restoration is slow work — especially in winter when the island closes and the only sound returning is the waves. This slowness settled into the house itself.' },
    { num: 'IV', title: 'Today', body: 'Five rooms, a courtyard, a small library, a kitchen. The whole proportion of the house was set so that a guest at breakfast never feels alone.' },
  ];
});
</script>

<template>
  <div class="about-editorial bg-cream text-ink font-raleway font-light">
    <section class="px-6 md:px-16 pt-16 md:pt-24 pb-12 md:pb-20">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-end">
        <h1
          class="md:col-span-7 font-display font-light leading-[0.92] tracking-display m-0"
          style="font-size: clamp(56px, 9vw, 128px); letter-spacing: -0.03em;"
        >
          <span class="block">{{ $t('aboutPage.titleLine1') }}</span>
          <span class="block italic text-peach" style="padding-left: 8%;">{{ $t('aboutPage.titleLine2') }}</span>
          <span class="block">{{ $t('aboutPage.titleLine3') }}</span>
        </h1>
        <div class="md:col-span-5">
          <Eyebrow class="mb-6">{{ $t('aboutPage.eyebrow') }}</Eyebrow>
          <p class="text-[16px] leading-[1.7] opacity-80 m-0">{{ $t('aboutPage.lede') }}</p>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-20 md:pb-28">
      <HotelImage src="homepage-3-min.jpg" :alt="$t('aboutPage.heroImageAlt')" class="h-[420px] md:h-[720px]" eager />
    </section>

    <section class="px-6 md:px-16 pb-20 md:pb-28 max-w-[1280px]">
      <div
        v-for="(c, i) in chapters"
        :key="i"
        class="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-6 md:gap-16 py-12 md:py-16 border-t border-ink/10 items-start"
      >
        <div class="font-display italic text-peach font-light leading-none" style="font-size: clamp(48px, 6vw, 64px);">
          {{ c.num }}
        </div>
        <h2 class="font-display font-light m-0" style="font-size: clamp(36px, 4.5vw, 56px); line-height: 1; letter-spacing: -0.02em;">
          {{ c.title }}
        </h2>
        <p class="text-[16px] leading-[1.75] opacity-85 m-0">{{ c.body }}</p>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-24 md:pb-40">
      <Eyebrow class="mb-10">{{ $t('aboutPage.quoteLabel') }}</Eyebrow>
      <blockquote
        class="font-display italic font-light m-0 max-w-[1100px] text-muted"
        style="font-size: clamp(36px, 6vw, 72px); line-height: 1.15; letter-spacing: -0.01em;"
      >
        {{ $t('aboutPage.quote') }}
      </blockquote>
      <div class="mt-8 text-[14px] opacity-60 italic">{{ $t('aboutPage.quoteAttr') }}</div>
    </section>

    <section class="px-6 md:px-16 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-2 gap-4">
      <HotelImage src="homepage-2-min.jpg" :alt="$t('aboutPage.imgCourtyardAlt')" class="h-[360px] md:h-[540px]" />
      <HotelImage src="homepage-5-min.jpg" :alt="$t('aboutPage.imgDetailAlt')" class="h-[360px] md:h-[540px]" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.about-editorial {
  scroll-snap-type: none;
  section {
    scroll-snap-align: none;
  }
}
</style>
