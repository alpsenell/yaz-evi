<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "v-calendar";
import YazButton from "../atoms/YazButton.vue";

interface Props {
  label?: string;
  columns?: number;
  disabledRanges?: any;
}

const date = ref(new Date());
const props = withDefaults(defineProps<Props>(), {
  label: "Select Dates",
  columns: 2,
});
const getDayAfter = (day: number) => {
  return new Date().getTime() + day * 24 * 60 * 60 * 1000;
};

const mockRange = ref({
  start: getDayAfter(1),
  end: getDayAfter(2)
});
const disabledDates = ref([
  {
    repeat: {
      months: [10, 11, 12, 1],
    },
  },
]);
</script>

<template>
  <div>
    <span v-if="label"></span>
    <button>
      {{ mockRange.start }}
      {{ mockRange.end }}
    </button>
  </div>

  <DatePicker
    ref="calendar"
    v-model="mockRange"
    :columns="columns"
    :is-range="true"
    :is-inline="false"
  >
    <template #footer>
      <div class="w-full px-4 pb-3">

      </div>
    </template>
  </DatePicker>
</template>
