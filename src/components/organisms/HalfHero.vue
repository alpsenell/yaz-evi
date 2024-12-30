<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  title: string
  description: string
  image: string
  imagePosition: string
  objectPosition?: string
}

const props = withDefaults(defineProps<Props>(), {
  imagePosition: 'left',
})

function getImageUrl() {
  return new URL(`../../assets/media/${props.image}`, import.meta.url)
}
</script>

<template>
  <section
    class="full-height-section half-hero w-screen md:h-screen grid grid-cols-1 lg:grid-cols-2"
  >
    <img
      :src="getImageUrl()"
      class="flex-1 object-cover w-full h-full max-h-screen"
      :class="props.imagePosition === 'left' ? '' : 'order-0 lg:order-1'"
    />
    <div class="flex flex-1 flex-col gap-6 lg:gap-10 justify-center px-4 py-6 md:p-6">
      <h3 class="text-2xl lg:text-6xl font-raleway lg:font-light">
        {{ props.title }}
      </h3>
      <p class="font-raleway text-lg lg:text-2xl font-light">
        {{ props.description }}
      </p>
    </div>
  </section>
</template>
