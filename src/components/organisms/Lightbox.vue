<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps<{
  open: boolean
  images: string[]
  index: number
  captions?: string[]
}>()

const emit = defineEmits(['close', 'update:index'])

const prev = () => {
  if (!props.images.length) return
  emit('update:index', (props.index - 1 + props.images.length) % props.images.length)
}

const next = () => {
  if (!props.images.length) return
  emit('update:index', (props.index + 1) % props.images.length)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.open) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

watch(() => props.open, (value) => {
  document.body.style.overflow = value ? 'hidden' : 'unset'
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] bg-[rgba(10,20,24,0.95)] flex items-center justify-center animate-[yzfade_0.3s_ease]"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <button
        type="button"
        class="absolute top-6 right-7 text-white font-jost text-[22px] cursor-pointer bg-transparent border-none"
        :aria-label="$t('accessibility.closeMenu')"
        @click="emit('close')"
      >✕</button>
      <button
        type="button"
        class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white text-[34px] cursor-pointer select-none p-4 bg-transparent border-none"
        aria-label="Previous"
        @click="prev"
      >‹</button>
      <img
        :src="images[index]"
        alt=""
        class="max-h-[86vh] max-w-[88vw] object-contain"
      >
      <button
        type="button"
        class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white text-[34px] cursor-pointer select-none p-4 bg-transparent border-none"
        aria-label="Next"
        @click="next"
      >›</button>
      <div
        v-if="captions?.length"
        class="absolute bottom-6 left-5 right-5 text-center text-white/75 font-serif italic font-light text-[17px]"
      >
        {{ captions[index] }}
      </div>
      <div v-else class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-jost text-[13px] tracking-[0.2em]">
        {{ index + 1 }} / {{ images.length }}
      </div>
    </div>
  </Teleport>
</template>
