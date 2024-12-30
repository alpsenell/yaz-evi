<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { HEADER_MENU_ITEMS } from "../../enums/global.ts";
import LanguageSelector from "./LanguageSelector.vue";
import YazIcon from "../atoms/YazIcon.vue";

const props = defineProps({
  visibility: Boolean,
})
const emits = defineEmits(['toggleMobileMenu']);
const visibilityClass = ref('invisible -z-10');

watch(()  => props.visibility, (value) => {
  if (value) {
    visibilityClass.value = 'visible z-10';
  } else {
    setTimeout(() => {
      visibilityClass.value = 'invisible -z-10';
    }, 300);
  }
});

const openPosition = computed(() => {
  return window.innerHeight <  500 ? 'up' : 'down';
});

</script>

<template>
  <div
    class="fixed top-0 h-full w-screen left-0"
    :class="visibilityClass"
  >
    <nav
      class="h-full w-fit relative z-10 bg-white transition-transform p-10 min-w-[90%] md:min-w-96"
      :class="{ 'translate-x-0': visibility, '-translate-x-full': !visibility }"
    >
      <YazIcon
        class="absolute top-10 right-8 cursor-pointer"
        name="cross"
        :size="32"
        color="black"
        @click="emits('toggleMobileMenu')"
      />

      <router-link to="/">
        <YazIcon
          name="yaz-evi"
          color="black"
          class=" max-[400px]:w-[150px] w-[200px] h-auto"
        />
      </router-link>

      <ul class="header__list overflow-y-visible h-auto flex flex-col items-baseline gap-4 justify-items-start mt-12">
        <li
          v-for="item in HEADER_MENU_ITEMS"
          class="cursor-pointer"
        >
          <router-link
            class="header__link sub-link text-base"
            :to=item.url
            @click="mobileMenu = false"
          >
            {{ $t(`${item.title}`) }}
          </router-link>
        </li>

        <LanguageSelector :open-position="openPosition" />
      </ul>
    </nav>
    <div
      class="overlay transition-opacity w-full h-full bg-black top-0 left-0 absolute"
      :class="{ 'opacity-40': visibility, 'opacity-0': !visibility }"
      @click="emits('toggleMobileMenu')"
    />
  </div>
</template>
