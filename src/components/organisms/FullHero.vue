<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

interface Props {
  title?: string
  description?: string
  color?: string
  image: string
}

const props = defineProps<Props>()

function getImageUrl() {
  return new URL(`../../assets/media/${props.image}`, import.meta.url)
}
</script>

<template>
  <section
    class="full-height-section full-hero w-screen md:h-screen relative"
  >
    <img
      :src="getImageUrl()"
      class="object-cover w-full h-full max-h-screen"
    />
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h3
        class="text-6xl font-montserrat font-normal"
        :style="{ color: props.color }"
      >
        {{ props.title }}
      </h3>
      <p class="font-raleway text-2xl font-light">
        {{ props.description }}
      </p>
    </div>
  </section>
</template>
