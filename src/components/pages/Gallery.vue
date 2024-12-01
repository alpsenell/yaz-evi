<script setup lang="ts">
import { defineComponent, ref } from 'vue';

interface Image {
  src: string;
  alt: string;
  isVisible: boolean;
}

  const images = ref<Image[]>([
    { name: 'oda_1/IMG_1766.jpg', alt: 'Image 1', isVisible: false },
    { name: 'oda_1/IMG_1772.jpg', alt: 'Image 2', isVisible: false },
    { name: 'oda_1/IMG_1789.jpg', alt: 'Image 2', isVisible: false },
    { name: 'oda_1/IMG_1812.jpg', alt: 'Image 2', isVisible: false },
    { name: 'oda_1/IMG_1843.jpg', alt: 'Image 2', isVisible: false },
    { name: 'oda_1/IMG_1772.jpg', alt: 'Image 2', isVisible: false },
  ]);

  function animate(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    entries.forEach(entry => {
      console.log(entry)
      if (entry.isIntersecting) {
        const imageIndex = images.value.findIndex(img => img.src === (entry.target as HTMLImageElement).src);
        if (imageIndex !== -1) {
          images.value[imageIndex].isVisible = true;
        }
      }
    });
  }

function getImageUrl(name) {
  return new URL(`/src/assets/media/${name}`, import.meta.url).href
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative overflow-hidden"
        v-intersect="{ callback: animate, options: { threshold: 0.5 } }"
      >
        <img
          :src="getImageUrl(image.name)"
          :alt="image.alt"
          class="w-full h-auto transform transition-transform duration-700 ease-out"
          :class="{ 'translate-x-full': !image.isVisible, 'translate-x-0': image.isVisible }"
        />
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>
