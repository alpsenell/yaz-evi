<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import visaLogo from '../assets/media/visa.webp'
import mastercardLogo from '../assets/media/mastercard.svg'
import iyzicoLogo from '../assets/media/iyzico.svg'
import iyzicoEnLogo from '../assets/media/iyzico-en.svg'

const { i18next } = useTranslation()
const iyzicoSrc = computed(() => i18next.language?.startsWith('tr') ? iyzicoLogo : iyzicoEnLogo)
const isTr = computed(() => i18next.language?.startsWith('tr'))
</script>

<template>
  <footer class="footer-editorial bg-cream text-ink w-full">
    <div class="w-full h-[420px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.824069050704!2d26.072010299999995!3d39.833362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b0413fb0eae813%3A0x96d129952cee20ad!2sYazevi%20Bozcaada!5e0!3m2!1sen!2str!4v1754561882895!5m2!1sen!2str"
        width="100%"
        height="420"
        style="border:0;"
        allowfullscreen="true"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        tabindex="-1"
      />
    </div>

    <div class="px-6 md:px-16 pt-20 pb-10 border-t border-ink/10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-16">
        <div class="md:col-span-5">
          <div class="font-serif-display italic text-3xl mb-4">Yaz Evi</div>
          <p class="font-raleway text-[14px] leading-relaxed opacity-70 max-w-[320px]">
            {{ $t('footer.tagline') }}
          </p>
        </div>

        <div class="md:col-span-3">
          <div class="eyebrow mb-5">{{ $t('footer.pages') }}</div>
          <ul class="space-y-1.5">
            <li>
              <router-link to="/rooms" class="text-link font-raleway text-[14px] opacity-85">
                {{ $t('navigation.rooms') }}
              </router-link>
            </li>
            <li>
              <router-link to="/gallery" class="text-link font-raleway text-[14px] opacity-85">
                {{ $t('navigation.gallery') }}
              </router-link>
            </li>
            <li>
              <router-link to="/experiences" class="text-link font-raleway text-[14px] opacity-85">
                {{ $t('navigation.experiences') }}
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-link font-raleway text-[14px] opacity-85">
                {{ $t('navigation.about') }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="md:col-span-2">
          <div class="eyebrow mb-5">{{ $t('footer.contact') }}</div>
          <a href="tel:+905324316734" class="text-link font-raleway text-[14px] opacity-85 block py-1">0532 431 67 34</a>
          <a href="mailto:info@yaz-evi.com" class="text-link font-raleway text-[14px] opacity-85 block py-1">info@yaz-evi.com</a>
          <p class="font-raleway text-[14px] opacity-85 leading-relaxed mt-2 mb-0">
            Alaybey Mah.<br/>Muratbey Sk. 12<br/>Bozcaada
          </p>
        </div>

        <div class="md:col-span-2">
          <div class="eyebrow mb-5">{{ $t('footer.season') }}</div>
          <div class="font-raleway text-[14px] opacity-85 py-1">{{ isTr ? 'Mayıs – Ekim 2026' : 'May – October 2026' }}</div>
          <div class="font-raleway text-[14px] opacity-85 py-1">Check-in 14:00</div>
          <div class="font-raleway text-[14px] opacity-85 py-1">Check-out 11:00</div>
          <a href="https://www.instagram.com/yazevibozcaada_/" class="inline-block mt-4">
            <img src="../assets/media/instagram.svg" alt="Instagram" class="w-6 h-auto"/>
          </a>
        </div>
      </div>

      <ul class="flex flex-row flex-wrap font-raleway text-sm gap-x-8 gap-y-2 mb-6">
        <li>
          <router-link class="text-link" to="/booking-terms">
            {{ $t('footer.termsAndPolicy') }}
          </router-link>
        </li>
        <li>
          <router-link class="text-link" to="/privacy-policy">
            {{ $t('footer.privacyPolicy') }}
          </router-link>
        </li>
        <li>
          <router-link class="text-link" to="/delivery-and-return">
            {{ $t('footer.deliveryAndReturn') }}
          </router-link>
        </li>
        <li>
          <router-link class="text-link" to="/distance-sales-agreement">
            {{ $t('footer.distanceSales') }}
          </router-link>
        </li>
      </ul>

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-ink/10">
        <span class="font-raleway text-[11px] uppercase tracking-widest2 opacity-50">© Yaz Evi 2026 · Bozcaada · Çanakkale</span>
        <div class="flex items-center gap-3">
          <img :src="visaLogo" alt="Visa" class="h-6">
          <img :src="mastercardLogo" alt="Mastercard" class="h-6">
          <img :src="iyzicoSrc" alt="iyzico" class="h-6">
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer-editorial {
  scroll-snap-align: none;
}
</style>
