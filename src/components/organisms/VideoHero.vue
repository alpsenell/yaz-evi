<script setup lang="ts">
import { defineProps } from 'vue'
import { getMediaUrl } from '../../utils/media'

const props = defineProps({
  mediaName: String,
  title: String,
  subtitle: String,
  posterName: String,
})
</script>

<template>
  <div class="full-height-section h-screen video-hero relative">
    <video
      class="video-hero__video h-full w-full"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      :poster="getMediaUrl(posterName)"
    >
      <source
        :src="getMediaUrl(mediaName)"
        type="video/mp4"
      >
    </video>
    <div class="video-hero__content">
      <h1 class="font-gravity text-9xl text-white">
        {{ title }}
      </h1>
      <p class="video-hero__subtitle font-raleway text-xl text-white mt-2" v-if="subtitle">{{ subtitle }}</p>
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
