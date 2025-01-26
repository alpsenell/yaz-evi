<script setup lang="ts">
import { defineProps, ref } from 'vue'

const props = defineProps({
  image: String,
})

const loaded = ref(false)
const getImageUrl = () => {
  return new URL(`../../assets/media/${props.image}`, import.meta.url)
}

const onLoaded = () => {
  loaded.value = true
}
</script>

<template>
  <div
    class="h-full w-full"
  >
    <transition name="fade">
      <img
        :src="getImageUrl()"
        v-show="loaded"
        v-on:load="onLoaded"
        :alt="`Image of ${props.image}`"
      />
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
