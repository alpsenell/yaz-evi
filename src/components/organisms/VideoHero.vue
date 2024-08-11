<script setup lang="ts">

</script>

<template>
  <div class="video-hero">
    <video class="video-hero__video" autoplay muted loop>
      <source
        src="https://yazevi.s3.eu-central-1.amazonaws.com/bozcaada.mp4"
        type="video/mp4"
      >
    </video>
    <div class="video-hero__content">
      <h1 class="video-hero__title">Welcome to Yaz Evi</h1>
      <p class="video-hero__text"></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-hero {
  position: relative;

  &__video {
    max-height: 100vh;
    object-fit: cover;
    object-position: center;
    width: 100%;
    min-height: 600px;
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
  }

  &__title {
    font-family: 'Gravity';
    font-size: 10rem;
  }
}
</style>
