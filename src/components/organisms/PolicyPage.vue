<script setup lang="ts">
// All props are i18n keys, translated in the template so language switches stay reactive
defineProps<{
  titleKey: string
  sections: { heading: string; paragraphs: string[] }[]
  updatedKey: string
}>()
</script>

<template>
  <main class="policy page-fade bg-cream min-h-screen">
    <div class="bg-ink text-parchment text-center px-6 pt-[100px] pb-14 md:pt-[132px] md:pb-[70px]">
      <div class="eyebrow-ink mb-5">{{ $t('v2.policy.eyebrow') }}</div>
      <h1 class="font-serif font-light text-[38px] md:text-[54px] lg:text-[64px] leading-[1.1] m-0">{{ $t(titleKey) }}</h1>
    </div>

    <div class="max-w-[820px] mx-auto px-6 py-[70px] md:py-[110px]">
      <section v-for="section in sections" :key="section.heading">
        <h2 class="font-serif font-light text-[26px] text-ink mt-0 mb-3">{{ $t(section.heading) }}</h2>
        <p
          v-for="(paragraph, index) in section.paragraphs"
          :key="paragraph"
          class="font-jost font-light text-[15.5px] leading-[1.95] text-slate mt-0"
          :class="index === section.paragraphs.length - 1 ? 'mb-8' : 'mb-2'"
        >{{ $t(paragraph) }}</p>
      </section>
      <div class="font-jost text-xs tracking-[0.14em] uppercase text-stone border-t border-sand pt-6">{{ $t(updatedKey) }}</div>
    </div>
  </main>
</template>
