<script setup lang="ts">

import HalfVideoHero from "../organisms/HalfVideoHero.vue";
import HalfHero from "../organisms/HalfHero.vue";
</script>

<template>
  <section class="experiences">
    <HalfVideoHero
      type="half"
      rotate
      src="https://yazevi.s3.eu-central-1.amazonaws.com/IMG_6413.MOV"
    >
      <div class="flex flex-col w-full justify-center items-center gap-8 py-6 px-4 md:p-6">
        <h1 class="font-montserrat text-2xl md:text-3xl text-center">{{ $t('pages.experiences.title') }}</h1>
        <div class="flex flex-col gap-4">
          <p class="font-raleway text-lg lg:text-xl font-light whitespace-pre-wrap">{{ $t('pages.experiences.firstDescription') }}</p>
          <p class="font-raleway text-lg lg:text-xl font-light whitespace-pre-wrap">{{ $t('pages.experiences.secondDescription') }}</p>
          <p class="font-raleway text-lg lg:text-xl font-light whitespace-pre-wrap">{{ $t('pages.experiences.thirdDescription') }}</p>
          <p class="font-raleway text-lg lg:text-xl font-light whitespace-pre-wrap">{{ $t('pages.experiences.fourthDescription') }}</p>
        </div>
      </div>
    </HalfVideoHero>

    <HalfHero
      image-position="right"
      :description="$t('pages.experiences.heroDescription')"
      image="experiences-1.jpg"
    />
  </section>
</template>

<style scoped lang="scss">

</style>
