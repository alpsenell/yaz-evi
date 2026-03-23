<script setup lang="ts">
import { defineProps } from 'vue'
import { getMediaUrl } from '../../utils/media'

interface Props {
  title?: string
  description?: string
  color?: string
  image: string
}

const props = defineProps<Props>()
</script>

<template>
  <section
    class="full-height-section full-hero w-screen h-screen relative"
  >
    <img
      :src="getMediaUrl(props.image)"
      class="object-cover w-full h-full max-h-screen"
      loading="lazy"
      :alt="props.title || 'Yaz Evi Bozcaada'"
    />
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h3
        class="text-4xl text-center font-montserrat font-normal lg:text-6xl"
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
