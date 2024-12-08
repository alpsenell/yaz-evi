<script setup lang="ts">
import { ROOMS } from "../../enums/global.ts";
import SliderHero from "../organisms/SliderHero.vue";
</script>

<template>
  <div>
    <SliderHero
      v-for="(room, index) in ROOMS"
      :title="$t(room.title)"
      :image-position="index % 2 === 0 ? 'left' : 'right'"
      :description="$t(room.description)"
      :images="room.images"
      size="half"
    />
  </div>
</template>
