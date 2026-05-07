<script setup lang="ts">
defineProps<{ title: string; index?: string }>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 md:gap-12 py-10 md:py-12 border-t border-ink/12">
    <div v-if="index" class="font-display italic text-peach leading-none" style="font-size: clamp(24px, 2.5vw, 32px);">
      {{ index }}
    </div>
    <div v-else></div>
    <div>
      <h2
        class="font-display font-light m-0 mb-6"
        style="font-size: clamp(28px, 3.5vw, 40px); line-height: 1.05; letter-spacing: -0.01em;"
      >
        {{ title }}
      </h2>
      <div class="text-[15px] md:text-[16px] leading-[1.75] opacity-85">
        <slot />
      </div>
    </div>
  </div>
</template>
