<script setup lang="ts">
import { HEADER_MENU_ITEMS } from "../../enums/global.ts";
import LanguageSelector from "./LanguageSelector.vue";
</script>

<template>
  <div
    class="fixed w-dvw bg-white top-0 transition-transform z-10"
    :class="{ 'translate-x-0': mobileMenu, 'translate-x-full': !mobileMenu }"
    :style="{ height: `calc(100dvh - ${headerHeight}px)`, top: `${headerHeight}px` }"
  >
    <nav class="h-full">
      <ul class="header__list h-full flex flex-col items-center gap-4 justify-center overflow-auto">
        <li v-for="item in HEADER_MENU_ITEMS">
          <router-link
            class="header__link sub-link text-xl"
            :to=item.url
            @click="mobileMenu = false"
          >
            {{ $t(`${item.title}`) }}
          </router-link>
        </li>
        <LanguageSelector open-position="up" />
      </ul>
    </nav>
  </div>
</template>

<style scoped>

</style>
