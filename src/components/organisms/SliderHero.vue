<script setup lang="ts">
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import { defineProps } from "vue";
import YazIcon from "../atoms/YazIcon.vue";

defineProps({
  images: Array,
  size: String,
  imagePosition: String,
  title: String,
  description: String,
})

function getImageUrl(image) {
  return new URL(`../../assets/media/${image}`, import.meta.url)
}
</script>

<template>
  <section
    class="w-screen grid grid-cols-1"
    :class="size === 'half' ? 'lg:grid-cols-2' : ''"
  >
    <div
      class="relative"
      :class="imagePosition === 'left' ? '' : 'order-0 lg:order-1'"
    >
      <Splide :has-track="false" :options="{ perPage: 1, type: 'loop', pagination: false }">
        <SplideTrack>
          <SplideSlide v-for="(image, index) in images">
            <img
              class="w-full h-full object-cover"
              :src="getImageUrl(image)"
              :alt="`Image of ${title}-${index + 1}`"
            />
          </SplideSlide>
        </SplideTrack>

        <div class="splide__arrows absolute bottom-4 right-4">
          <button class="splide__arrow splide__arrow--prev relative">
            <YazIcon name="left" color="white" />
          </button>
          <button class="splide__arrow splide__arrow--next relative">
            <YazIcon name="right" color="white" />
          </button>
        </div>
      </Splide>
    </div>

    <div class="flex flex-1 flex-col gap-10 justify-center px-4 py-6 md:p-6">
      <h3 class="text-4xl font-raleway font-light">
        {{ title }}
      </h3>
      <p class="font-raleway text-xl font-light">
        {{ description }}
      </p>
    </div>
  </section>
</template>

<style lang="scss">
.splide {
  &__arrows {
    display: flex;
    gap: 10px;
  }

  .splide__arrow {
    border: 1px solid white;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
    position: relative;
    top: unset;
    left: unset;
    right: unset;
    transform: unset;
    opacity: 1;
    background: transparent;

    svg {
      fill: white;
      transition: fill 0.2s;
    }

    &:hover {
      background: white;
      opacity: 1;

      svg {
        fill: black;
      }
    }

    &--prev svg {
      transform: unset;
    }
  }
}
</style>
