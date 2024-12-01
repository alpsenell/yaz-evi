<script setup lang="ts">
import { useTemplateRef, ref, watch } from "vue";
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { HEADER_MENU_ITEMS } from "./enums/global.ts";
import LanguageSelector from "./components/organisms/LanguageSelector.vue";

const mobileMenu = ref(false);
const headerHeight = ref(0);

const openMobileMenu = () => {
  headerHeight.value = document.querySelector('.header')?.clientHeight

  mobileMenu.value = !mobileMenu.value
}

watch(mobileMenu, (value) => {
  console.log(value)
  if (value) {
    document.body.style.position = 'fixed'
  } else {
    document.body.style.position = 'unset'
  }
})

</script>

<template>
  <div>
    <Header @openMobileMenu="openMobileMenu" />
    <router-view />
    <Footer />
  </div>
  <div
    class="fixed w-dvw bg-white top-0 transition-transform z-10"
    :class="{ 'translate-x-0': mobileMenu, 'translate-x-full': !mobileMenu }"
    :style="{ height: `calc(100dvh - ${headerHeight}px)`, top: `${headerHeight}px` }"
  >
    <nav class="h-full">
      <ul class="header__list h-full flex flex-col items-center gap-8 justify-center overflow-auto">
        <li v-for="item in HEADER_MENU_ITEMS">
          <router-link
            class="header__link sub-link text-3xl"
            :to=item.url
          >
            {{ $t(`${item.title}`) }}
          </router-link>
        </li>
        <LanguageSelector />
      </ul>
    </nav>
  </div>
</template>

<style scoped>

</style>
