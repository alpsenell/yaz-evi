<script setup lang="ts">
import TransitionImage from "../atoms/TransitionImage.vue";
import { GALLERY_IMAGES } from "../../enums/global.ts";
</script>

<template>
  <section class="p-4 pt-24">
    <h1 class="invisible">{{ $t('gallery') }}</h1>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="index in 4"
        class="hidden md:flex flex-col gap-4 overflow-hidden"
      >
        <template
          v-for="(image, childIndex) in GALLERY_IMAGES"
          :key="`image-${childIndex}`"
        >
          <div
            v-if="(childIndex + 1) % 4 === (index % 4)"
            class="relative overflow-hidden"
          >
            <TransitionImage
              class="hover:scale-110 cursor-pointer transition-transform"
              :image="image"
            />
          </div>
        </template>
      </div>

      <div
        v-for="index in 2"
        class="flex md:hidden flex-col gap-2"
      >
        <template
          v-for="(image, childIndex) in GALLERY_IMAGES"
          :key="`image-${childIndex}`"
        >
          <div
            v-if="(childIndex + 1) % 2 === (index % 2)"
            class="relative overflow-hidden"
          >
            <TransitionImage :image="image" />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

