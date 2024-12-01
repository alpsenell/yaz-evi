<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import TransitionImage from "../atoms/TransitionImage.vue";

interface Image {
  src: string;
  alt: string;
  isVisible: boolean;
}

const images = ref<Image[]>([
  { name: 'oda_1/IMG_1766.jpg', alt: 'Image 1', isVisible: false },
  { name: 'oda_1/IMG_1772.jpg', alt: 'Image 2', isVisible: false },
  { name: 'oda_1/IMG_1789.jpg', alt: 'Image 3', isVisible: false },
  { name: 'oda_1/IMG_1812.jpg', alt: 'Image 4', isVisible: false },
  { name: 'oda_1/IMG_1843.jpg', alt: 'Image 5', isVisible: false },
  { name: 'oda_1/IMG_1910.jpg', alt: 'Image 6', isVisible: false },
  { name: 'oda_1/IMG_1915.jpg', alt: 'Image 7', isVisible: false },
  { name: 'oda_1/IMG_1927.jpg', alt: 'Image 8', isVisible: false },
]);

function animate(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const imageIndex = images.value.findIndex(img => (entry.target as HTMLImageElement).src.includes(img.name));
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative overflow-hidden"
      >
        <TransitionImage
          :image="image.name"
        />
      </div>
    </div>
  </div>
</template>

