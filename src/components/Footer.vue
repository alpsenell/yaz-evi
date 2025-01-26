<script setup lang="ts">
import YazIcon from "./atoms/YazIcon.vue";
</script>

<template>
  <footer class="full-height-section bg-tertiary w-full pb-12">
    <div class="w-full h-[500px]">
      <gmp-map center="39.833438873291016,26.07203483581543" zoom="14" map-id="DEMO_MAP_ID">
        <gmp-advanced-marker position="39.833438873291016,26.07203483581543" title="My location"></gmp-advanced-marker>
      </gmp-map>
    </div>

    <div class="max-w-screen-2xl flex flex-col md:flex-row gap-10 md:gap-20 mx-auto px-10 mt-10">
      <YazIcon
        name="yaz-evi"
        color="black"
        class="w-24 w-[160px] h-auto"
      />

      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <YazIcon name="phone" :size="16" color="black" />

          <a
            class="text-link font-raleway w-fit"
            href="tel:+905303062021"
          >
            0530 306 20 21
          </a>
        </div>
        <div class="flex gap-4">
          <YazIcon name="mail" :size="16" color="black" />

          <a
            class="text-link font-raleway w-fit"
            href="mailto:info@yaz-evi.com"
          >
            info@yaz-evi.com
          </a>
        </div>

        <div class="flex gap-4">

          <YazIcon name="maps" :size="16" color="black" />
          <a
            class="text-link font-raleway w-fit"
            href="https://goo.gl/maps/7Z3"
          >
            Yaz Evi, Bozcaada, Turkey
          </a>
        </div>
      </div>

      <div class="flex justify-center md:justify-end flex-1">
        <div class="flex gap-4">
          <a
            href="https://www.instagram.com/yazevibozcaada_/"
          >
            <img
              src="../assets/media/instagram.svg"
              alt="Instagram"
              class="w-[30px] h-auto"
            >
          </a>
        </div>
      </div>
    </div>

    <ul class="max-w-screen-2xl flex flex-row justify-center md:justify-end ga-6 font-raleway text-sm gap-8 mt-6 mx-auto">
      <li>
        &copy; 2024 Yaz Evi
      </li>
      <li>
        <a
          class="text-link"
          href="/"
        >
          Privacy Policy
        </a>
      </li>
    </ul>
  </footer>
</template>

<style scoped>

</style>
