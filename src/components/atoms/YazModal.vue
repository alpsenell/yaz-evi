<script setup lang="ts">

import YazIcon from "./YazIcon.vue";
</script>

<template>
  <transition name="slide-in">
    <div
      class="yaz-modal fixed top-0 left-0 w-[90vw] h-[90vh]"

    >
      <div class="flex justify-between p-4">
        <h1 class="font-gravity text-4xl">
          {{ title }}
        </h1>

        <button @click="$emit('close')">
          <YazIcon
            name="cross"
            :size="32"
            color="black"
          />
        </button>
      </div>

      <slot/>
    </div>
  </transition>
</template>

<style scoped lang="scss">

</style>
