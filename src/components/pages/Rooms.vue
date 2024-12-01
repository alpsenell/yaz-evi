<script setup lang="ts">

import HalfHero from "../organisms/HalfHero.vue";
import { ROOMS } from "../../enums/global.ts";
</script>

<template>
  <div>
    <h1 class="my-8 md:my-12 text-6xl font-raleway md:text[72px] text-center mx-auto max-w-screen-lg">{{ $t('rooms')}} </h1>

    <HalfHero
      v-for="(room, index) in ROOMS"
      :title="$t(room.title)"
      :image-position="index % 2 === 0 ? 'left' : 'right'"
      :description="$t(room.description)"
      :image="room.image"
    />
  </div>
</template>
