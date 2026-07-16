<script setup lang="ts">
import { ref, watch, computed, nextTick, onBeforeUnmount } from "vue";
import { useTranslation } from 'i18next-vue';
import YazIcon from "../atoms/YazIcon.vue";
import { capitalize } from "../../utils/analytics";

const { t, i18next } = useTranslation();

const menuTrackName = (url: string) => `clickOnMenu${capitalize(url.replace('/', '')) || 'Home'}`;

const props = defineProps({
  visibility: Boolean,
})
const emits = defineEmits(['toggleMobileMenu']);
const visibilityClass = ref('invisible -z-10');
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const navRef = ref<HTMLElement | null>(null);

const navItems = [
  { title: 'v2.nav.home', url: '/' },
  { title: 'v2.nav.rooms', url: '/rooms' },
  { title: 'v2.nav.experiences', url: '/experiences' },
  { title: 'v2.nav.gallery', url: '/gallery' },
  { title: 'v2.nav.about', url: '/about' },
  { title: 'v2.nav.contact', url: '/contact' },
];

const currentLanguage = computed(() => i18next.language?.startsWith('tr') ? 'tr' : 'en');
const setLanguage = (lang: string) => {
  i18next.changeLanguage(lang);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emits('toggleMobileMenu');
    return;
  }

  if (e.key !== 'Tab' || !navRef.value) return;

  const focusable = navRef.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

watch(() => props.visibility, (value) => {
  if (value) {
    visibilityClass.value = 'visible z-50';
    document.addEventListener('keydown', handleKeydown);
    nextTick(() => {
      closeButtonRef.value?.focus();
    });
  } else {
    document.removeEventListener('keydown', handleKeydown);
    setTimeout(() => {
      visibilityClass.value = 'invisible -z-10';
    }, 300);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    class="fixed inset-0 h-full w-screen transition-opacity duration-300"
    :class="[visibilityClass, visibility ? 'opacity-100' : 'opacity-0']"
    role="dialog"
    :aria-modal="visibility"
    :aria-hidden="!visibility"
    :aria-label="t('accessibility.navigationMenu')"
  >
    <nav
      ref="navRef"
      class="h-full w-full bg-inkDeep text-parchment flex flex-col"
    >
      <div class="flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <router-link to="/" :aria-label="t('accessibility.goHome')" v-track="'clickOnMenuLogo'" @click="emits('toggleMobileMenu')">
          <YazIcon
            name="yaz-evi"
            color="white"
            class="w-[120px] md:w-[140px] h-auto"
          />
        </router-link>
        <button
          ref="closeButtonRef"
          type="button"
          class="font-jost text-[13px] tracking-[0.28em] uppercase cursor-pointer bg-transparent border-none p-0 text-parchment"
          :aria-label="t('accessibility.closeMenu')"
          @click="emits('toggleMobileMenu')"
        >
          {{ $t('v2.close') }} ✕
        </button>
      </div>

      <ul class="flex-1 flex flex-col justify-center gap-1.5 px-6 md:px-10 list-none m-0">
        <li
          v-for="(item, index) in navItems"
          :key="item.url"
        >
          <router-link
            class="font-serif font-light text-[34px] md:text-[46px] text-parchment py-2 inline-block hover:text-azureSoft transition-colors"
            :to="item.url"
            v-track="menuTrackName(item.url)"
            @click="emits('toggleMobileMenu')"
          >
            <span class="font-serif text-[15px] text-azureSoft mr-4 align-middle">0{{ index + 1 }}</span>{{ $t(item.title) }}
          </router-link>
        </li>
      </ul>

      <div class="px-6 py-6 md:px-10 md:py-8 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center font-jost text-xs tracking-[0.18em]">
        <a href="tel:+905324316734" class="text-parchment">+90 532 431 67 34</a>
        <span class="uppercase tracking-[0.24em]">
          <button
            type="button"
            class="cursor-pointer bg-transparent border-none p-0 text-inherit uppercase tracking-[inherit]"
            :class="{ 'opacity-50': currentLanguage !== 'en' }"
            @click="setLanguage('en')"
          >EN</button>
          <span class="opacity-40"> / </span>
          <button
            type="button"
            class="cursor-pointer bg-transparent border-none p-0 text-inherit uppercase tracking-[inherit]"
            :class="{ 'opacity-50': currentLanguage !== 'tr' }"
            @click="setLanguage('tr')"
          >TR</button>
        </span>
        <a
          href="https://www.instagram.com/yazevibozcaada_/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-parchment"
        >@yazevibozcaada_</a>
      </div>
    </nav>
  </div>
</template>
