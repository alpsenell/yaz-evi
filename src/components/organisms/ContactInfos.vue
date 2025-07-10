<script
  setup
  lang="ts"
>
import YazIcon from "../atoms/YazIcon.vue";
</script>

<template>
  <div class="mt-8 flex flex-col gap-2">
    <div class="flex gap-4">
      <YazIcon
        name="phone"
        :size="16"
        color="black"
      />

      <a
        class="text-link font-raleway w-fit"
        href="tel:+905324316734"
      >
        0532 431 67 34
      </a>
    </div>
    <div class="flex gap-4">
      <YazIcon
        name="mail"
        :size="16"
        color="black"
      />

      <a
        class="text-link font-raleway w-fit !lowercase"
        href="mailto:info@yaz-evi.com"
      >
        info@yaz-evi.com
      </a>
    </div>

    <div class="flex gap-4">
      <YazIcon
        name="maps"
        :size="16"
        color="black"
      />
      <a
        class="text-link font-raleway w-fit"
        href="https://goo.gl/maps/7Z3"
      >
        {{ $t('hotelAddress') }}
      </a>
    </div>
  </div>
</template>
