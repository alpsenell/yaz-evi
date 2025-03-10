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
      <div class="flex flex-col w-full justify-center items-center gap-8 px-4 py-6 md:p-20">
        <h1 class="text-3xl font-raleway font-light">
          {{ $t('pages.experiences.title') }}
        </h1>
        <div class="flex flex-col gap-4">
          <p class="font-raleway text-base font-light">
            {{ $t('pages.experiences.firstDescription') }}
          </p>
          <p class="font-raleway text-base font-light">
            {{ $t('pages.experiences.secondDescription') }}
          </p>
          <p class="font-raleway text-base font-light">
            {{ $t('pages.experiences.thirdDescription') }}
          </p>
          <p class="font-raleway text-base font-light">
            {{ $t('pages.experiences.fourthDescription') }}
          </p>
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
