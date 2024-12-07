<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { HEADER_MENU_ITEMS } from "../enums/global.ts";
import LanguageSelector from "./organisms/LanguageSelector.vue";

const emit = defineEmits(['openMobileMenu']);

const header = ref<Element>();
const menuVisibility = ref(false);

const openMenu = () => {
  menuVisibility.value = !menuVisibility.value;
  emit("openMenu");
};

</script>

<template>
  <header
    ref="header"
    class="header fixed h-24 md:h-32 bg-transparent top-0 items-center flex z-10 transition-transform duration-500 w-full"
  >
    <div class="header__inner flex mx-auto w-[90%]">
      <div
        class="block relative w-10 flex-column cursor-pointer top-3"
        :class="{ 'header__mobile-menu-open': false }"
        @click="openMenu"
      >
        <span class="absolute block h-0.5 bg-secondaryDark w-full rounded l-0 transition-transform top-0 origin-left"></span>
        <span class="absolute block h-0.5 bg-secondaryDark w-full rounded l-0 transition-transform top-2 origin-left"></span>
        <span class="absolute block h-0.5 bg-secondaryDark w-full rounded l-0 transition-transform top-4 origin-left"></span>
      </div>

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

        <LanguageSelector/>
      </div>

      <div
        class="block md:hidden relative w-10 flex-column cursor-pointer top-3"
        :class="{ 'header__mobile-menu-open': false }"
        @click="openMenu"
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
      top: 0;
      left: 0;
    }

    span:nth-child(2) {
      opacity: 0;
      width: 0;
    }

    span:nth-child(3) {
      transform: rotate(-45deg);
      top: 29px;
      left: 0;
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
