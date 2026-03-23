<script setup lang="ts">
  import VideoHero from "../organisms/VideoHero.vue";
  import HalfHero from "../organisms/HalfHero.vue";
  import MixedGallery from "../organisms/MixedGallery.vue";
  import FullHero from "../organisms/FullHero.vue";
  import TextAndButton from "../organisms/TextAndButton.vue";
  import { getMediaUrl } from '../../utils/media';
</script>

<template>
  <div class="home">
    <VideoHero
      :title="$t('welcomeToYazEvi')"
      mediaName="opening_video.mp4"
      posterName="homepage-3-min.jpg"
    />

    <TextAndButton :button-label="$t('homepage.textAndButton.button')">
      <h2 class="font-raleway text-3xl my-4">{{ $t('homepage.textAndButton.title') }}</h2>
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
      image="homepage-6-min.jpg"
      color="#ffffff"
    />

    <MixedGallery>
      <template #left>
        <h2 class="font-raleway text-3xl my-4">{{ $t('gallery') }}</h2>
        <img
          class="w-full md:w-9/12"
          :src="getMediaUrl('home-gallery/gallery_left_1.jpg')"
          alt="Yaz Evi Bozcaada butik otel iç mekan ve tarihi taş duvarlar"
          loading="lazy"
        />
        <img
          class="w-full"
          :src="getMediaUrl('home-gallery/gallery_left_2.jpg')"
          alt="Yaz Evi Bozcaada oda dekorasyonu ve ahşap detaylar"
          loading="lazy"
        />
      </template>
      <template #right>
        <img
          :src="getMediaUrl('home-gallery/gallery_right_1.jpg')"
          alt="Yaz Evi Bozcaada avlu ve bahçe manzarası"
          loading="lazy"
        />
      </template>
    </MixedGallery>
  </div>
</template>
