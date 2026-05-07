<script setup lang="ts">
  import { useTranslation } from 'i18next-vue';
  import YazIcon from "./atoms/YazIcon.vue";
  import { HEADER_MENU_ITEMS, LANGUAGES } from "../enums/global.ts";
  import { useRoute } from 'vue-router';

  const { t, i18next } = useTranslation();
  const route = useRoute();
  const emit = defineEmits(['toggleMobileMenu']);

  const switchLang = (code: string) => {
    if (i18next.language?.startsWith(code)) return;
    i18next.changeLanguage(code);
  };

  const isActive = (url: string) => route.path === url || route.path.startsWith(url + '/');
  const isLang = (code: string) => i18next.language?.startsWith(code);
</script>

<template>
  <header class="header-editorial w-full bg-cream text-ink relative z-20 border-b border-ink/10">
    <div class="hidden md:grid items-center px-16 py-8" style="grid-template-columns: 1fr auto 1fr;">
      <nav class="flex gap-7 text-[12px] uppercase font-medium tracking-nav">
        <router-link
          v-for="item in HEADER_MENU_ITEMS"
          :key="item.url"
          :to="item.url"
          class="header-editorial__link"
          :class="{ 'header-editorial__link--active': isActive(item.url) }"
        >
          {{ $t(item.title) }}
        </router-link>
      </nav>

      <router-link
        to="/"
        :aria-label="t('accessibility.goHome')"
        class="block text-ink no-underline"
      >
        <YazIcon name="yaz-evi" color="black" class="w-[140px] h-auto md:w-[150px]" />
      </router-link>

      <div class="flex items-center justify-end gap-4 text-[12px] uppercase font-medium tracking-nav">
        <template v-for="(lang, idx) in LANGUAGES" :key="lang.value">
          <button
            type="button"
            class="bg-transparent border-none p-0 cursor-pointer text-ink"
            :class="isLang(lang.value) ? 'opacity-100 font-semibold' : 'opacity-35'"
            @click="switchLang(lang.value)"
          >
            {{ lang.value.toUpperCase() }}
          </button>
          <span v-if="idx < LANGUAGES.length - 1" class="opacity-20">·</span>
        </template>
        <router-link
          to="/booking"
          class="ml-2 px-5 py-2.5 border border-ink rounded-full text-[11px] uppercase tracking-nav text-ink no-underline"
        >
          {{ $t('reserve') }}
        </router-link>
      </div>
    </div>

    <div class="md:hidden flex items-center justify-between px-6 py-5">
      <button
        type="button"
        class="block relative w-9 h-9 cursor-pointer bg-transparent border-none p-0"
        :aria-label="t('accessibility.openMenu')"
        @click="emit('toggleMobileMenu')"
      >
        <span class="absolute block h-0.5 bg-ink w-full rounded l-0 top-2"></span>
        <span class="absolute block h-0.5 bg-ink w-full rounded l-0 top-4"></span>
        <span class="absolute block h-0.5 bg-ink w-full rounded l-0 top-6"></span>
      </button>

      <router-link
        to="/"
        :aria-label="t('accessibility.goHome')"
        class="font-display italic text-xl tracking-[0.04em] text-ink no-underline"
      >
        Yaz Evi
      </router-link>

      <router-link
        to="/booking"
        class="px-3 py-2 border border-ink rounded-full text-[10px] uppercase tracking-nav text-ink no-underline"
      >
        {{ $t('reserve') }}
      </router-link>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-editorial {
  scroll-snap-align: none;

  &__link {
    color: inherit;
    text-decoration: none;
    padding-bottom: 4px;
    border-bottom: 1px solid transparent;
    opacity: 0.5;
    transition: opacity 0.2s ease, border-color 0.2s ease;

    &:hover {
      opacity: 1;
    }

    &--active {
      opacity: 1;
      border-bottom-color: #FAAA8D;
    }
  }
}
</style>
