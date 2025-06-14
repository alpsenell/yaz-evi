<script setup lang="ts">
import { ROOMS } from "../../enums/global.ts";
import SliderHero from "../organisms/SliderHero.vue";
</script>

<template>
  <div>
    <section class="full-height-section pt-32 px-4 md:pt-40 pb-10 max-w-screen-lg flex flex-col mx-auto">
      <h1 class="font-montserrat text-2xl md:text-3xl text-center">
        {{ $t('roomsPage.title') }}
      </h1>
      <p class="font-montserrat text-base md:text-xl text-center mb-4">{{ $t('roomsPage.subtitle') }}</p>
    </section>

    <div class="flex flex-col gap-10 md:gap-20">
      <SliderHero
        v-for="(room, index) in ROOMS"
        :title="$t(room.title)"
        :image-position="index % 2 === 0 ? 'left' : 'right'"
        :description="$t(room.description)"
        :images="room.images"
        size="half"
      />
    </div>
  </div>
</template>
