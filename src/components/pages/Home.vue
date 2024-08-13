<script setup lang="ts">

import VideoHero from "../organisms/VideoHero.vue";
import TextAndButton from "../organisms/TextAndButton.vue";
import HalfHero from "../organisms/HalfHero.vue";
import MixedGallery from "../organisms/MixedGallery.vue";
</script>

<template>
  <div class="home">
    <VideoHero/>
    <TextAndButton>
      <div class="flex flex-col gap-4">
        <h2 class="text-4xl capitalize font-raleway font-light">Bozcaada's most exclusive home</h2>
        <p class="text-base font-raleway font-light">With just four beautifully appointed pavilions, Pretty Beach House is the most exclusive
          luxury lodge in Australia. A 90-minute drive north of Sydney, the lodge sits high above the village of Pretty
          Beach, nestled into the rugged bushland of Bouddi National Park on the spectacular Bouddi Peninsula.
          <br>
          Come to Pretty Beach House to unwind in seclusion among the trees and be pampered in luxury. Indulge in
          delicious seasonal dishes expertly paired with fine wines, immerse in nature and return home rejuvenated and
          re-energised.</p>
      </div>
    </TextAndButton>

    <HalfHero
      title="The Pavilions"
      description="Each of the four pavilions at Pretty Beach House is designed to make the most of the stunning views and
      natural surroundings. The interiors are spacious and light-filled, with a contemporary Australian aesthetic
      that reflects the beauty of the bushland outside."
      image="home_1.jpg"
      imagePosition="left"
    />

    <HalfHero
      title="The Pavilions"
      description="Each of the four pavilions at Pretty Beach House is designed to make the most of the stunning views and
      natural surroundings. The interiors are spacious and light-filled, with a contemporary Australian aesthetic
      that reflects the beauty of the bushland outside."
      image="home_2.jpg"
      imagePosition="right"
    />

    <MixedGallery>
      <template #left>
        <h3 class="font-raleway text-3xl">Gallery</h3>
        <img
          class="w-9/12"
          src="../../assets/media/home-gallery/gallery_left_1.jpg"
        />
        <img
          class="w-full"
          src="../../assets/media/home-gallery/gallery_left_2.jpg"
        />
      </template>
      <template #right>
        <img
          src="../../assets/media/home-gallery/gallery_right_1.jpg"
        />
      </template>
    </MixedGallery>
  </div>
</template>

<style scoped>

</style>
