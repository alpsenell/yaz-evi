<script setup lang="ts">
  import YazIcon from "./atoms/YazIcon.vue";

  const emit = defineEmits(['toggleMobileMenu']);
</script>

<template>
  <header class="header fixed bg-transparent top-0 items-center flex z-10 transition-transform duration-500 w-full">
    <div class="header__inner mt-8 flex justify-between md:justify-start gap-10 mx-auto w-[90%]">
      <div
        class="block relative w-10 flex-column cursor-pointer top-4"
        :class="{ 'header__mobile-menu-open': false }"
        @click="emit('toggleMobileMenu')"
      >
        <span
          class="absolute block h-0.5 bg-white w-full rounded l-0 transition-transform top-0 origin-left"></span>
        <span
          class="absolute block h-0.5 bg-white w-full rounded l-0 transition-transform top-2 origin-left"></span>
        <span
          class="absolute block h-0.5 bg-white w-full rounded l-0 transition-transform top-4 origin-left"></span>
      </div>

      <router-link to="/">
        <YazIcon
          name="yaz-evi"
          color="white"
          class=" max-[400px]:w-[150px] w-[200px] h-auto"
        />
      </router-link>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  background-image: linear-gradient(180deg, #bfbdba 0%, rgba(255, 255, 255, 0) 100%);

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
