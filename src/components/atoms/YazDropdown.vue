<script setup lang="ts">
import { computed, defineProps, withDefaults, ref } from "vue";
import YazIcon from "./YazIcon.vue";
import YazButton from "./YazButton.vue";

interface Props {
  options: string[];
  selectedValue?: string;
  openPosition?: string;
}
const props = withDefaults(defineProps<Props>(), {
  options: [],
  selectedValue: '',
  openPosition: 'down',
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
    >
      <YazButton
        v-if="selectedOption.label"
        type="outlined-simple"
        :label="$t(selectedOption.label)"
        small
        @click="dropdownStatus = !dropdownStatus"
      >
        <YazIcon
          v-if="dropdownStatus"
          name="up"
          :size="16"
          color="#a97057"
        />

        <YazIcon
          v-else
          name="down"
          :size="16"
          color="#a97057"
        />
      </YazButton>
    </div>

    <div
      class="flex absolute bg-white z-10 shadow-2xl w-full"
      :class="{ 'hidden': !dropdownStatus, 'bottom-full mb-2': openPosition === 'up', 'mt-2': openPosition === 'down' }"
    >
      <div class="flex flex-col w-full">
        <div
          v-for="(option, index) in props.options"
          :key="index"
          class="yaz-dropdown__option flex gap-1 cursor-pointer px-4 py-4 hover:bg-tertiary"
          @click="emit('selectValue', option.value)"
        >
          <YazIcon
            v-if="option.icon"
            :name="option.icon"
            class="rounded-full"
          />

          <p
            v-if="option.label"
            class="text-secondaryDark"
          >
            {{ $t(option.label) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
