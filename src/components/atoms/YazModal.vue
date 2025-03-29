<script setup lang="ts">
import YazIcon from "./YazIcon.vue";

const props = defineProps<{
  status: Boolean,
}>();
const emit = defineEmits(['close']);
</script>

<template>
  <transition>
    <div
      v-show="status"
      class="fixed w-[90vw] h-[90vh] z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div class="flex justify-end p-4">
        <YazIcon
          name="cross"
          :size="32"
          color="white"
          type="button"
          class="z-30 cursor-pointer"
          tabindex="0"
          @click="emit('close')"
          @keyup.escape="emit('close')"
        />
      </div>

      <slot/>
    </div>
  </transition>
  <div
    v-if="status"
    class="top-0 left-0 bg-black opacity-45 w-screen h-screen z-10 fixed"
    @click="emit('close')"
  />
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
