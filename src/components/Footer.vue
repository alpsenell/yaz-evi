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
  <footer class="bg-inkDeep text-[#cdd8db] px-6 md:px-14 pt-16 md:pt-24 pb-12">
    <div class="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-9 md:gap-12 pb-11 md:pb-16 border-b border-[rgba(205,216,219,0.16)]">
      <div class="col-span-2 md:col-span-1">
        <YazIcon
          name="yaz-evi"
          color="white"
          class="w-[150px] h-auto mb-6"
        />
        <p class="font-serif italic text-[21px] text-azureSoft m-0 max-w-[260px]">
          {{ $t('v2.footer.tagline') }}
        </p>
      </div>

      <div>
        <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azureSoft mb-5">{{ $t('v2.footer.findUs') }}</div>
        <a
          href="https://maps.app.goo.gl/djGuToKY5A9Hmucp9"
          target="_blank"
          rel="noopener noreferrer"
          class="font-jost font-light text-sm leading-[1.9]"
        >
          Alaybey Mah. Muratbey Sk. 12<br>Bozcaada / Çanakkale
        </a>
      </div>

      <div>
        <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azureSoft mb-5">{{ $t('v2.footer.contact') }}</div>
        <p class="font-jost font-light text-sm leading-[1.9] m-0">
          <a href="tel:+905324316734">+90 532 431 67 34</a><br>
          <a href="mailto:info@yaz-evi.com">info@yaz-evi.com</a>
        </p>
      </div>

      <div>
        <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azureSoft mb-5">{{ $t('v2.footer.follow') }}</div>
        <p class="font-jost font-light text-sm leading-[1.9] m-0">
          <a
            href="https://www.instagram.com/yazevibozcaada_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram<br>@yazevibozcaada_
          </a>
        </p>
      </div>
    </div>

    <ul class="flex flex-wrap gap-x-6 gap-y-3 justify-start md:justify-end list-none m-0 p-0 pt-6">
      <li>
        <router-link
          class="font-jost text-xs text-[rgba(205,216,219,0.75)] hover:text-white transition-colors"
          to="/booking-terms"
        >
          {{ $t('footer.termsAndPolicy') }}
        </router-link>
      </li>
      <li>
        <router-link
          class="font-jost text-xs text-[rgba(205,216,219,0.75)] hover:text-white transition-colors"
          to="/privacy-policy"
        >
          {{ $t('footer.privacyPolicy') }}
        </router-link>
      </li>
      <li>
        <router-link
          class="font-jost text-xs text-[rgba(205,216,219,0.75)] hover:text-white transition-colors"
          to="/delivery-and-return"
        >
          {{ $t('footer.deliveryAndReturn') }}
        </router-link>
      </li>
      <li>
        <router-link
          class="font-jost text-xs text-[rgba(205,216,219,0.75)] hover:text-white transition-colors"
          to="/distance-sales-agreement"
        >
          {{ $t('footer.distanceSales') }}
        </router-link>
      </li>
    </ul>

    <div class="flex flex-wrap gap-4 justify-between items-center pt-5 font-jost text-xs text-[rgba(205,216,219,0.6)]">
      <div class="flex items-center gap-4">
        <span>&copy; 2024 Yaz Evi Bozcaada</span>
        <div class="flex items-center gap-2 opacity-60">
          <img :src="visaLogo" alt="Visa" class="h-4">
          <img :src="mastercardLogo" alt="Mastercard" class="h-4">
          <img :src="iyzicoSrc" alt="iyzico" class="h-4">
        </div>
      </div>
      <div class="flex gap-5 uppercase tracking-[0.18em] text-[11px]">
        <router-link to="/rooms" class="hover:text-white transition-colors">{{ $t('v2.nav.rooms') }}</router-link>
        <router-link to="/gallery" class="hover:text-white transition-colors">{{ $t('v2.nav.gallery') }}</router-link>
        <router-link to="/contact" class="hover:text-white transition-colors">{{ $t('v2.nav.contact') }}</router-link>
      </div>
    </div>
  </footer>
</template>
