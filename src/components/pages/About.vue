<script setup lang="ts">
import HalfHero from "../organisms/HalfHero.vue";
import YazButton from "../atoms/YazButton.vue";
</script>

<template>
  <section class="about">
    <HalfHero
      :description="$t('pages.about.history')"
      image="windmills-vertical.webp"
      imagePosition="left"
    >
      <div class="flex gap-4 mt-4">
        <YazButton
          class="w-fit"
          type="primary"
          :label="$t('homepage.textAndButton.button')"
          href="/booking"
        />
        <YazButton
          class="w-fit"
          type="outlined"
          :label="$t('pages.about.getDirections')"
          external-link
          href="https://maps.app.goo.gl/djGuToKY5A9Hmucp9"
        />
      </div>
    </HalfHero>
  </section>
</template>
