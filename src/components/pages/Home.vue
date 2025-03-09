<script setup lang="ts">
  import VideoHero from "../organisms/VideoHero.vue";
  import HalfHero from "../organisms/HalfHero.vue";
  import MixedGallery from "../organisms/MixedGallery.vue";
  import FullHero from "../organisms/FullHero.vue";
  import TextAndButton from "../organisms/TextAndButton.vue";
</script>

<template>
  <div class="home">
    <VideoHero
      :title="$t('welcomeToYazEvi')"
      src="https://yazevi.s3.eu-central-1.amazonaws.com/bozcaada.mp4"
    />

    <TextAndButton :button-label="$t('homepage.textAndButton.button')">
      <h3 class="font-raleway text-3xl my-4">{{ $t('homepage.textAndButton.title') }}</h3>
      <p class="font-raleway text-lg my-6">{{ $t('homepage.textAndButton.descriptionFirst') }}</p>
      <p class="font-raleway text-lg my-6">{{ $t('homepage.textAndButton.descriptionSecond') }}</p>
    </TextAndButton>

    <HalfHero
      :description="$t('homepage.textAndButton.descriptionSecond')"
      image="homepage-1-min.jpg"
      imagePosition="left"
    />

    <HalfHero
      :description="$t('homepage.textAndButton.descriptionThird')"
      image="homepage-2-min.jpg"
      imagePosition="right"
    />

    <FullHero
      :title="$t('homepage.untouchedNature').toUpperCase()"
      image="homepage-3-min.jpg"
      color="#ffffff"
    />

    <HalfHero
      :description="$t('homepage.textAndButton.descriptionFourth')"
      image="homepage-4-min.jpg"
      imagePosition="left"
    />

    <HalfHero
      :description="$t('homepage.textAndButton.descriptionFifth')"
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
