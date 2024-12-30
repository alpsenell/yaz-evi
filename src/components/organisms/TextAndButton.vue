<script setup lang="ts">
import { defineProps } from "vue";
import YazButton from "../atoms/YazButton.vue";
defineProps({ buttonLabel: String });
</script>

<template>
  <section class="text-and-button max-w-screen-lg px-4 mx-auto text-center py-10 md:px-0">
    <slot />

    <yaz-button
      class="mt-4 mx-auto"
      :label="buttonLabel"
      type="outlined"
    />
  </section>
</template>
