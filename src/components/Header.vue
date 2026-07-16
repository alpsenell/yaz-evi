<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useTranslation } from 'i18next-vue';
  import YazIcon from "./atoms/YazIcon.vue";

  const { t, i18next } = useTranslation();
  const emit = defineEmits(['toggleMobileMenu']);

  const route = useRoute();
  const scrolled = ref(false);

  const onScroll = () => {
    scrolled.value = window.scrollY > 90;
  };

  onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
  });

  // Pages without a dark image hero behind the header need the solid style from the top
  const solidRoutes = ['/contact', '/checkout'];
  const solid = computed(() =>
    scrolled.value
    || solidRoutes.some(p => route.path.startsWith(p))
    || route.path.startsWith('/booking/confirmation')
  );

  const currentLanguage = computed(() => i18next.language?.startsWith('tr') ? 'tr' : 'en');
  const setLanguage = (lang: string) => {
    i18next.changeLanguage(lang);
  };
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center text-white px-6 md:px-14 transition-all duration-300"
    :class="solid ? 'py-4 bg-inkDeep shadow-[0_6px_24px_rgba(0,0,0,0.18)]' : 'py-7 bg-gradient-to-b from-[rgba(16,32,40,0.5)] to-transparent'"
  >
    <div class="flex items-center gap-5">
      <button
        type="button"
        class="flex flex-col gap-[5px] w-[26px] cursor-pointer bg-transparent border-none p-0"
        :aria-label="t('accessibility.openMenu')"
        v-track="'clickOnHeaderMenuToggle'"
        @click="emit('toggleMobileMenu')"
      >
        <span class="block h-px bg-white w-full"></span>
        <span class="block h-px bg-white w-full"></span>
        <span class="block h-px bg-white w-[70%]"></span>
      </button>
      <span class="hidden md:block font-jost text-xs tracking-[0.3em] uppercase">{{ $t('v2.menu') }}</span>
    </div>

    <router-link to="/" :aria-label="t('accessibility.goHome')" class="justify-self-center" v-track="'clickOnHeaderLogo'">
      <YazIcon
        name="yaz-evi"
        color="white"
        class="w-[92px] md:w-[150px] h-auto"
      />
    </router-link>

    <div class="justify-self-end flex items-center gap-3 md:gap-6">
      <span class="hidden md:block font-jost text-xs tracking-[0.24em] uppercase">
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
      <router-link
        to="/booking"
        class="font-jost text-[10px] md:text-xs tracking-[0.14em] md:tracking-[0.26em] uppercase border border-white/60 px-2.5 py-2 md:px-6 md:py-3 whitespace-nowrap hover:bg-white hover:text-ink transition-colors duration-300"
      >
        {{ $t('v2.book') }}
      </router-link>
    </div>
  </header>
</template>
