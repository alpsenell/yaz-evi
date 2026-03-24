<script setup lang="ts">
import { ref, watch, computed, nextTick, onBeforeUnmount } from "vue";
import { useTranslation } from 'i18next-vue';
import { HEADER_MENU_ITEMS } from "../../enums/global.ts";
import LanguageSelector from "./LanguageSelector.vue";
import YazIcon from "../atoms/YazIcon.vue";
import ContactInfos from "./ContactInfos.vue";

const { t } = useTranslation();

const props = defineProps({
  visibility: Boolean,
})
const emits = defineEmits(['toggleMobileMenu']);
const visibilityClass = ref('invisible -z-10');
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const navRef = ref<HTMLElement | null>(null);

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
    visibilityClass.value = 'visible z-10';
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

const openPosition = computed(() => {
  return window.innerHeight < 500 ? 'up' : 'down';
});

</script>

<template>
  <div
    class="fixed top-0 h-full w-screen left-0"
    :class="visibilityClass"
    role="dialog"
    :aria-modal="visibility"
    :aria-hidden="!visibility"
    :aria-label="t('accessibility.navigationMenu')"
  >
    <nav
      ref="navRef"
      class="h-full w-fit relative z-10 bg-white transition-transform p-10 min-w-[90%] md:min-w-96"
      :class="{ 'translate-x-0': visibility, '-translate-x-full': !visibility }"
    >
      <button
        ref="closeButtonRef"
        type="button"
        class="absolute top-10 right-8 cursor-pointer bg-transparent border-none p-0"
        :aria-label="t('accessibility.closeMenu')"
        @click="emits('toggleMobileMenu')"
      >
        <YazIcon
          name="cross"
          :size="32"
          color="black"
        />
      </button>

      <router-link to="/" :aria-label="t('accessibility.goHome')">
        <YazIcon
          name="yaz-evi"
          color="black"
          class=" max-[400px]:w-[150px] w-[200px] h-auto"
        />
      </router-link>

      <ul class="header__list overflow-y-visible h-auto flex flex-col items-baseline gap-4 justify-items-start mt-12">
        <li
          v-for="item in HEADER_MENU_ITEMS"
          :key="item.url"
          class="cursor-pointer"
        >
          <router-link
            class="header__link sub-link text-base"
            :to="item.url"
            @click="emits('toggleMobileMenu')"
          >
            {{ $t(`${item.title}`) }}
          </router-link>
        </li>

        <LanguageSelector :open-position="openPosition" />

        <ContactInfos />
      </ul>
    </nav>
    <div
      class="overlay transition-opacity w-full h-full bg-black top-0 left-0 absolute"
      :class="{ 'opacity-40': visibility, 'opacity-0': !visibility }"
      @click="emits('toggleMobileMenu')"
    />
  </div>
</template>
