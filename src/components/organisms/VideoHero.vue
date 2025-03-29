<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  mediaName: String,
  title: String,
  posterName: String,
})
function getAssetUrl(name) {
  return new URL(`../../assets/media/${name}`, import.meta.url)
}
</script>

<template>
  <div class="full-height-section h-screen video-hero relative">
    <video
      class="video-hero__video h-full w-full"
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
    <div class="video-hero__content">
      <h1 class="font-gravity text-9xl text-white">
        {{ title }}
      </h1>
      <p class="video-hero__text"></p>
    </div>
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
