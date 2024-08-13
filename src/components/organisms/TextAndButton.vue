<script setup lang="ts">

import YazButton from "../atoms/YazButton.vue";
</script>

<template>
  <section class="text-and-button max-w-screen-lg mx-auto text-center py-10">
    <slot />

    <yaz-button
      class="mt-4"
      label="reserve now"
      type="outlined"
    />
  </section>
</template>
