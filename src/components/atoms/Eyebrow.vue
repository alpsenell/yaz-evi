<script setup lang="ts">
defineProps<{ accent?: boolean; noDash?: boolean }>();
</script>

<template>
  <div
    class="font-raleway text-[11px] uppercase font-semibold tracking-eyebrow leading-none"
    :class="accent ? 'text-peach opacity-100' : 'text-ink opacity-55'"
  >
    <span v-if="!noDash">— </span><slot />
  </div>
</template>
