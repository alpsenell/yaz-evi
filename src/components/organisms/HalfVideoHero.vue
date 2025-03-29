<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  mediaName: String,
  posterName: String,
})

function getAssetUrl(name) {
  return new URL(`../../assets/media/${name}`, import.meta.url)
}
</script>

<template>
  <div
    class="full-height-section md:h-screen md:grid md:grid-cols-2 video-hero relative flex flex-col"
  >
    <video
      class="video-hero__video w-full h-full"
      autoplay
      muted
      loop
      playsinline
      :poster="getAssetUrl(posterName)"
    >
      <source
        :src="getAssetUrl(mediaName)"
        type="video/mp4"
      >
    </video>
    <slot/>
  </div>
</template>

<style scoped lang="scss">
.video-hero {
  &__video {
    max-height: 100vh;
    object-fit: cover;
    object-position: center;
    min-height: 600px;
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
  }
}
</style>
