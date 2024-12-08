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
    <transition name="show">
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
.show-enter-active {
  animation: bounce-in 0.5s;
}
.show-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
