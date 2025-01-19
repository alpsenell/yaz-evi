<script setup lang="ts">
import { ref, computed } from "vue";
import { DatePicker } from "v-calendar";

const props = defineProps({
  selectedDates: {
    type: Object,
    required: true,
  },
  formattedDates: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['change']);
const showCalendar = ref(false);
const handleDateChange = (dates: { start: Date | null; end: Date | null }) => {
  emit('change', dates);
};
const closeCalendar = () => {
  showCalendar.value = false;
};
</script>

<template>
  <div
    class="trigger relative w-fit"
    v-click-outside="closeCalendar"
  >
    <button
      class="w-full border font-raleway border-gray-300 rounded-lg px-4 py-2 text-left hover:border-black"
      @click="showCalendar = !showCalendar"
    >
      {{ formattedDates }}
    </button>

    <DatePicker
      v-if="showCalendar"
      ref="calendar"
      :model-value="selectedDates"
      class="!absolute top-full z-10 left-0"
      is-range
      :columns="2"
      :is-inline="false"
      :popover="{ placement: 'bottom' }"
      @blur="closeCalendar"
      @update:model-value="handleDateChange"
    />
  </div>
</template>
