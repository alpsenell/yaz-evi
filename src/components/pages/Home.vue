<script setup lang="ts">

import VideoHero from "../organisms/VideoHero.vue";
import TextAndButton from "../organisms/TextAndButton.vue";
import HalfHero from "../organisms/HalfHero.vue";
import MixedGallery from "../organisms/MixedGallery.vue";
import FullHero from "../organisms/FullHero.vue";
</script>

<template>
  <div class="home">
    <VideoHero/>

    <HalfHero
      title="The Pavilions"
      description="Each of the four pavilions at Pretty Beach House is designed to make the most of the stunning views and
      natural surroundings. The interiors are spacious and light-filled, with a contemporary Australian aesthetic
      that reflects the beauty of the bushland outside."
      image="homepage-1-min.jpg"
      imagePosition="left"
    />

    <HalfHero
      title="The Pavilions"
      description="Each of the four pavilions at Pretty Beach House is designed to make the most of the stunning views and
      natural surroundings. The interiors are spacious and light-filled, with a contemporary Australian aesthetic
      that reflects the beauty of the bushland outside."
      image="homepage-2-min.jpg"
      imagePosition="right"
    />

    <FullHero
      :title="$t('homepage.untouchedNature').toUpperCase()"
      image="homepage-3-min.jpg"
      color="#ffffff"
    />

    <HalfHero
      title="The Pavilions"
      description="Each of the four pavilions at Pretty Beach House is designed to make the most of the stunning views and
      natural surroundings. The interiors are spacious and light-filled, with a contemporary Australian aesthetic
      that reflects the beauty of the bushland outside."
      image="homepage-4-min.jpg"
      imagePosition="left"
    />

    <HalfHero
      title="The Pavilions"
      description="Each of the four pavilions at Pretty Beach House is designed to make the most of the stunning views and
      natural surroundings. The interiors are spacious and light-filled, with a contemporary Australian aesthetic
      that reflects the beauty of the bushland outside."
      image="homepage-5-min.jpg"
      imagePosition="right"
    />

    <FullHero
      :title="$t('homepage.untouchedNature').toUpperCase()"
      image="homepage-6-min.jpg"
      color="#ffffff"
    />

    <MixedGallery>
      <template #left>
        <h3 class="font-raleway text-3xl my-4">Gallery</h3>
        <img
          class="w-full md:w-9/12"
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
