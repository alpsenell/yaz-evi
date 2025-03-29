<script setup lang="ts">
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import { defineProps } from "vue";
import YazIcon from "../atoms/YazIcon.vue";
import YazButton from "../atoms/YazButton.vue";

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
    class="full-height-section w-screen flex flex-col lg:flex-row"
  >
    <div
      class="relative max-h-screen lg:max-h-[700px] flex-[1.4]"
      :class="imagePosition === 'left' ? '' : 'order-0 lg:order-1'"
    >
      <Splide
        class="h-full"
        :has-track="false"
        :options="{ perPage: 1, type: 'loop', pagination: false }"
      >
        <SplideTrack class="h-full">
          <SplideSlide
            v-for="(image, index) in images"
            class="max-h-screen"
          >
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

    <div
      class="flex flex-1 flex-col gap-10 justify-center px-4 py-6 md:p-20 items-center"
      :class="imagePosition === 'right' ? 'md:items-end' : 'md:items-start'"
    >
      <h3 class="text-3xl font-raleway font-light">
        {{ title }}
      </h3>
      <p class="font-raleway text-base font-light">
        {{ description }}
      </p>
      <div class="flex gap-4">
        <YazButton :label="$t('details')" type="outlined" />
        <YazButton :label="$t('reserve')" type="primary" href="booking" />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.splide {
  &__arrows {
    display: flex;
  }

  .splide__arrow {
    border: 1px solid white;
    width: 48px;
    height: 48px;
    border-radius: 0;
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
