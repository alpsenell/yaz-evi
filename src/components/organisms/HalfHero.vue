<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

interface Props {
  title: string
  description: string
  image: string
  imagePosition: string
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
    class="half-hero w-screen h-screen flex flex-row min-h-[600px]"
    :class="props.imagePosition === 'left' ? 'flex-row' : 'flex-row-reverse'"
  >
    <img :src="getImageUrl()" alt="" class="flex-1 object-cover" />
    <div class="flex flex-1 flex-col gap-10 justify-end p-6">
      <h3 class="text-6xl font-raleway font-light">
        {{ props.title }}
      </h3>
      <p class="font-raleway text-2xl font-light">
        {{ props.description }}
      </p>
    </div>
  </section>
</template>

<style scoped>

</style>
