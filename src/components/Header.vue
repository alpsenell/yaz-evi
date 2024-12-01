<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { HEADER_MENU_ITEMS } from "../enums/global.ts";
import LanguageSelector from "./organisms/LanguageSelector.vue";

const emit = defineEmits(['openMobileMenu']);

const header = ref<Element>();
const lastScrollY = ref<number>(0);
const scrollDirection = ref("No scrolling yet");
const mobileMenu = ref(false);

const openMobileMenu = () => {
  mobileMenu.value = !mobileMenu.value;
  emit("openMobileMenu");
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY.value) {
    scrollDirection.value = "Scrolling down";
  } else if (currentScrollY < lastScrollY.value) {
    scrollDirection.value = "Scrolling up";
  }

  lastScrollY.value = currentScrollY;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    ref="header"
    class="header h-24 md:h-32 bg-white sticky top-0 items-center flex z-10 transition-transform duration-500 w-full"
    :class="{ '-translate-y-full': scrollDirection === 'Scrolling down' }"
  >
    <div class="header__inner flex justify-between mx-auto w-[90%]">
      <router-link to="/">
        <img
          src="../assets/media/yaz-evi.svg"
          alt="Logo"
          class="w-24 md:w-[160px] h-auto"
        >
      </router-link>

      <div class="header__right hidden items-center md:flex">
        <nav>
          <ul class="header__list flex flex-row items-center gap-4 justify-center">
            <li v-for="item in HEADER_MENU_ITEMS">
              <router-link
                class="header__link sub-link"
                :to=item.url
              >
                {{ $t(`${item.title}`) }}
              </router-link>
            </li>
          </ul>
        </nav>
        <div class="header__contact">
          <svg class="header__phone-icon" fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M11.748 5.773S11.418 5 10.914 5c-.496 0-.754.229-.926.387S6.938 7.91 6.938 7.91s-.837.731-.773 2.106c.054 1.375.323 3.332 1.719 6.058 1.386 2.72 4.855 6.876 7.047 8.337 0 0 2.031 1.558 3.921 2.191.549.173 1.647.398 1.903.398.26 0 .719 0 1.246-.385.536-.389 3.543-2.807 3.543-2.807s.736-.665-.119-1.438c-.859-.773-3.467-2.492-4.025-2.944-.559-.459-1.355-.257-1.699.054-.343.313-.956.828-1.031.893-.112.086-.419.365-.763.226-.438-.173-2.234-1.148-3.899-3.426-1.655-2.276-1.837-3.02-2.084-3.824a.56.56 0 0 1 .225-.657c.248-.172 1.161-.933 1.161-.933s.591-.583.344-1.27-1.906-4.716-1.906-4.716z"></path>
            </g>
          </svg>
          <a href="tel:+905303062021">0530 306 20 21</a>
        </div>
        <LanguageSelector/>
      </div>

      <div
        class="block md:hidden relative w-14 flex-column cursor-pointer top-3"
        :class="{ 'header__mobile-menu-open': mobileMenu }"
        @click="openMobileMenu"
      >
        <span class="absolute block h-0.5 bg-secondaryDark w-full rounded l-0 transition-transform top-0 origin-left"></span>
        <span class="absolute block h-0.5 bg-secondaryDark w-full rounded l-0 transition-transform top-4 origin-left"></span>
        <span class="absolute block h-0.5 bg-secondaryDark w-full rounded l-0 transition-transform top-8 origin-left"></span>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  &__mobile-menu-open {
    span:nth-child(1) {
      transform: rotate(45deg);
      top: -3px;
      left: 8px;
    }

    span:nth-child(2) {
      opacity: 0;
      width: 0;
    }

    span:nth-child(3) {
      transform: rotate(-45deg);
      top: 37px;
      left: 8px;
    }
  }

  &__phone-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  &__right {
    flex-direction: row;
    gap: 24px;
  }

  &__contact {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
}
</style>
