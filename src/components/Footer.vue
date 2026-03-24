<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import YazIcon from "./atoms/YazIcon.vue";
import visaLogo from '../assets/media/visa.webp'
import mastercardLogo from '../assets/media/mastercard.svg'
import iyzicoLogo from '../assets/media/iyzico.svg'
import iyzicoEnLogo from '../assets/media/iyzico-en.svg'

const { i18next } = useTranslation()
const iyzicoSrc = computed(() => i18next.language?.startsWith('tr') ? iyzicoLogo : iyzicoEnLogo)
</script>

<template>
  <footer class="full-height-section bg-tertiary w-full pb-12">
    <div class="w-full h-[500px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.824069050704!2d26.072010299999995!3d39.833362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b0413fb0eae813%3A0x96d129952cee20ad!2sYazevi%20Bozcaada!5e0!3m2!1sen!2str!4v1754561882895!5m2!1sen!2str"
        width="100%"
        height="450"
        style="border:0;"
        allowfullscreen="true"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        tabindex="-1"
      />
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
            href="tel:+905324316734"
          >
            0532 431 67 34
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
            {{ $t('hotelAddress') }}
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

    <ul class="max-w-screen-2xl flex flex-row flex-wrap justify-center md:justify-end font-raleway text-sm gap-x-8 gap-y-2 mt-6 mx-auto px-10">
      <li>
        <router-link
          class="text-link"
          to="/booking-terms"
        >
          {{ $t('footer.termsAndPolicy') }}
        </router-link>
      </li>
      <li>
        <router-link
          class="text-link"
          to="/privacy-policy"
        >
          {{ $t('footer.privacyPolicy') }}
        </router-link>
      </li>
      <li>
        <router-link
          class="text-link"
          to="/delivery-and-return"
        >
          {{ $t('footer.deliveryAndReturn') }}
        </router-link>
      </li>
      <li>
        <router-link
          class="text-link"
          to="/distance-sales-agreement"
        >
          {{ $t('footer.distanceSales') }}
        </router-link>
      </li>
    </ul>

    <div class="max-w-screen-2xl flex flex-row flex-wrap items-center justify-center md:justify-end gap-4 mt-4 mx-auto px-10">
      <span class="font-raleway text-xs text-gray-500">&copy; 2024 Yaz Evi</span>
      <div class="flex items-center gap-3">
        <img :src="visaLogo" alt="Visa" class="h-6">
        <img :src="mastercardLogo" alt="Mastercard" class="h-6">
        <img :src="iyzicoSrc" alt="iyzico" class="h-6">
      </div>
    </div>
  </footer>
</template>

<style scoped>

</style>
