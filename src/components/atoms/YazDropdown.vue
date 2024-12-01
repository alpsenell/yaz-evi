<script setup lang="ts">
import { computed, defineProps, withDefaults, ref } from "vue";
import YazIcon from "./YazIcon.vue";

interface Props {
  options: string[];
  selectedValue?: string;
}
const props = withDefaults(defineProps<Props>(), {
  options: [],
  selectedValue: ''
});
const emit = defineEmits(['selectValue']);

const selectedOption = computed(() => {
  if (!props.selectedValue) {
    return null
  }

  return props.options.find(option => option.value === props.selectedValue);
});
const dropdownStatus = ref(false);
</script>

<template>
  <div
    class="yaz-dropdown relative"
    v-click-outside="() => { dropdownStatus = false }"
  >
    <div
      v-if="!selectedOption"
      class="cursor-pointer"
      @click="dropdownStatus = !dropdownStatus"
    >
      {{ $t('selectOption') }}
    </div>
    <div
      v-else
      class="flex cursor-pointer"
      @click="dropdownStatus = !dropdownStatus"
    >
      <YazIcon
        v-if="selectedOption.icon"
        :name="selectedOption.icon"
        class="rounded-full"
      />

      <p v-if="selectedOption.label">
        {{ selectedOption.label }}
      </p>
    </div>

    <div
      class="flex absolute bg-white z-10 p-4 shadow"
      :class="{ 'hidden': !dropdownStatus }"
    >
      <div class="flex flex-col gap-1">
        <div
          v-for="(option, index) in props.options"
          :key="index"
          class="yaz-dropdown__option flex gap-1 cursor-pointer"
          @click="emit('selectValue', option.value)"
        >
          <YazIcon
            v-if="option.icon"
            :name="option.icon"
            class="rounded-full"
          />

          <p v-if="option.label">
            {{ option.label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
