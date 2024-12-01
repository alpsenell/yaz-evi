<script setup lang="ts">

import YazButton from "../atoms/YazButton.vue";
</script>

<template>
  <section class="text-and-button max-w-screen-lg px-4 mx-auto text-center py-10 md:px-0">
    <slot />

    <yaz-button
      class="mt-4 mx-auto"
      label="reserve now"
      type="outlined"
    />
  </section>
</template>
