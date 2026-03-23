<script setup lang="ts">
import { getMediaUrl } from '../../utils/media'

interface Props {
  title?: string
  description?: string
  image: string
  imagePosition: string
  objectPosition?: string
}

const props = withDefaults(defineProps<Props>(), {
  imagePosition: 'left',
})
</script>

<template>
  <section
    class="full-height-section half-hero w-screen md:h-screen grid grid-cols-1 lg:grid-cols-2"
  >
    <img
      :src="getMediaUrl(props.image)"
      class="flex-1 object-cover w-full h-full max-h-screen"
      :class="props.imagePosition === 'left' ? '' : 'order-0 lg:order-1'"
      loading="lazy"
      :alt="props.title || 'Yaz Evi Bozcaada'"
    />
    <div class="flex flex-1 flex-col gap-6 lg:gap-10 justify-center px-4 py-6 md:p-20">
      <h2
        v-if="title"
        class="text-3xl font-raleway font-light">
        {{ props.title }}
      </h2>
      <div>
        <p
          class="font-raleway text-base font-light"
          v-html="description"
        />

        <slot />
      </div>
    </div>
  </section>
</template>
