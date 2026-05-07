<script setup lang="ts">
import Eyebrow from '../atoms/Eyebrow.vue';

defineProps<{
  eyebrow: string;
  title: string;
  lede?: string;
  lastUpdated?: string;
}>();
</script>

<template>
  <div class="legal-page bg-cream text-ink font-raleway font-light">
    <section class="px-6 md:px-16 pt-16 md:pt-24 pb-12 md:pb-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-end">
        <div class="md:col-span-8">
          <Eyebrow class="mb-6">{{ eyebrow }}</Eyebrow>
          <h1
            class="font-display font-light leading-[0.95] m-0"
            style="font-size: clamp(48px, 7vw, 96px); letter-spacing: -0.02em;"
          >
            <span class="italic text-peach">{{ title }}</span>
          </h1>
        </div>
        <p
          v-if="lede"
          class="md:col-span-4 text-[15px] leading-[1.7] opacity-80 m-0"
        >
          {{ lede }}
        </p>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-20 md:pb-32 max-w-[920px]">
      <slot />
      <div v-if="lastUpdated" class="mt-16 pt-8 border-t border-ink/10 text-[11px] tracking-widest3 uppercase opacity-50">
        {{ lastUpdated }}
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.legal-page {
  scroll-snap-type: none;
  section {
    scroll-snap-align: none;
  }
}
</style>
