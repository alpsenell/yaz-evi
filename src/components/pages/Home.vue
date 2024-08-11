<script setup lang="ts">

import VideoHero from "../organisms/VideoHero.vue";
import TextAndButton from "../organisms/TextAndButton.vue";
import HalfHero from "../organisms/HalfHero.vue";
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
      image="r1.jpg"
      imagePosition="left"
    />

    <HalfHero
      title="The Pavilions"
      description="Each of the four pavilions at Pretty Beach House is designed to make the most of the stunning views and
      natural surroundings. The interiors are spacious and light-filled, with a contemporary Australian aesthetic
      that reflects the beauty of the bushland outside."
      image="r3.jpg"
      imagePosition="right"
    />
  </div>
</template>

<style scoped>

</style>
