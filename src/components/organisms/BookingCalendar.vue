<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DateRange } from '../../types/booking'

interface DayCell {
  key: string
  day: number | null
  date: Date | null
  state: 'blank' | 'past' | 'booked' | 'edge' | 'mid' | 'open'
}

const props = defineProps<{
  modelValue: { start: Date | null; end: Date | null }
  bookedRanges: DateRange[]
  locale?: string
}>()

const emit = defineEmits(['update:modelValue'])

const today = new Date()
today.setHours(0, 0, 0, 0)

const baseMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const normalize = (d: Date) => {
  const n = new Date(d)
  n.setHours(0, 0, 0, 0)
  return n
}

// Checkout day stays bookable: a day is blocked when start <= d < end
const isBooked = (d: Date) =>
  props.bookedRanges.some(r => d >= normalize(r.start) && d < normalize(r.end))

const sameDay = (a: Date | null, b: Date) =>
  !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const rangeHasBooked = (start: Date, end: Date) => {
  const d = new Date(start)
  d.setDate(d.getDate() + 1)
  while (d < end) {
    if (isBooked(d)) return true
    d.setDate(d.getDate() + 1)
  }
  return false
}

const select = (cell: DayCell) => {
  if (!cell.date || cell.state === 'past' || cell.state === 'booked') return
  const d = cell.date
  const { start, end } = props.modelValue
  if (!start || (start && end)) {
    emit('update:modelValue', { start: d, end: null })
    return
  }
  if (d > start && !isBooked(start) && !rangeHasBooked(start, d)) {
    emit('update:modelValue', { start, end: d })
  } else {
    emit('update:modelValue', { start: d, end: null })
  }
}

const isTurkish = computed(() => props.locale?.startsWith('tr'))
const weekdays = computed(() =>
  isTurkish.value ? ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
)

const monthLabel = (first: Date) =>
  new Intl.DateTimeFormat(isTurkish.value ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' }).format(first)

const buildMonth = (offset: number) => {
  const first = new Date(baseMonth.value.getFullYear(), baseMonth.value.getMonth() + offset, 1)
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const leading = (first.getDay() + 6) % 7 // Monday-first
  const { start, end } = props.modelValue

  const cells: DayCell[] = []
  for (let i = 0; i < leading; i++) {
    cells.push({ key: `b${offset}-${i}`, day: null, date: null, state: 'blank' })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(first.getFullYear(), first.getMonth(), day)
    let state: DayCell['state'] = 'open'
    if (date < today) state = 'past'
    else if (isBooked(date)) state = 'booked'
    else if (sameDay(start, date) || sameDay(end, date)) state = 'edge'
    else if (start && end && date > start && date < end) state = 'mid'
    cells.push({ key: `d${offset}-${day}`, day, date, state })
  }
  return { label: monthLabel(first), cells }
}

const months = computed(() => [buildMonth(0), buildMonth(1)])

const canGoPrev = computed(() =>
  baseMonth.value.getFullYear() > today.getFullYear()
  || (baseMonth.value.getFullYear() === today.getFullYear() && baseMonth.value.getMonth() > today.getMonth())
)

const shiftMonths = (delta: number) => {
  if (delta < 0 && !canGoPrev.value) return
  baseMonth.value = new Date(baseMonth.value.getFullYear(), baseMonth.value.getMonth() + delta, 1)
}

const cellClass = (state: DayCell['state']) => {
  switch (state) {
    case 'booked': return 'bg-transparent text-[#c2b49a] line-through cursor-default'
    case 'past': return 'bg-transparent text-[#c2b49a]/70 cursor-default'
    case 'edge': return 'bg-ink text-white cursor-pointer'
    case 'mid': return 'bg-sandFill text-ink cursor-pointer'
    case 'open': return 'bg-transparent text-ink cursor-pointer hover:bg-[#F0E8D9] transition-colors'
    default: return 'bg-transparent'
  }
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="absolute -top-1.5 left-0 w-9 h-9 flex items-center justify-center text-[26px] font-light cursor-pointer bg-transparent border-none select-none z-[1] transition-opacity"
      :class="canGoPrev ? 'text-ink hover:opacity-60' : 'text-[#c2b49a] cursor-default opacity-40'"
      aria-label="Previous month"
      @click="shiftMonths(-1)"
    >‹</button>
    <button
      type="button"
      class="absolute -top-1.5 right-0 w-9 h-9 flex items-center justify-center text-[26px] font-light text-ink cursor-pointer bg-transparent border-none select-none z-[1] hover:opacity-60 transition-opacity"
      aria-label="Next month"
      @click="shiftMonths(1)"
    >›</button>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-10">
      <div v-for="month in months" :key="month.label">
        <div class="text-center font-serif text-[22px] text-ink mb-3">{{ month.label }}</div>
        <div class="grid grid-cols-7">
          <div
            v-for="dow in weekdays"
            :key="month.label + dow"
            class="text-center font-jost text-[11px] tracking-[0.06em] uppercase text-stone pb-2"
          >{{ dow }}</div>
          <button
            v-for="cell in month.cells"
            :key="cell.key"
            type="button"
            class="flex items-center justify-center h-11 font-jost font-light text-sm border-none p-0"
            :class="cellClass(cell.state)"
            :disabled="!cell.date || cell.state === 'past' || cell.state === 'booked'"
            @click="select(cell)"
          >{{ cell.day ?? '' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
