<script setup lang="ts">
import { ref } from 'vue';
import { getMediaUrl } from '../../utils/media';

const props = defineProps<{
  src: string;
  alt?: string;
  label?: string;
  rounded?: boolean;
  eager?: boolean;
}>();

const ok = ref(true);
const url = props.src.startsWith('http') ? props.src : getMediaUrl(props.src);
</script>

<template>
  <div class="hotel-image w-full h-full bg-[#e8e0d4] relative overflow-hidden" :class="rounded === false ? '' : 'rounded-[4px]'">
    <img
      v-if="ok"
      :src="url"
      :alt="alt || label || ''"
      class="w-full h-full object-cover block"
      :loading="eager ? 'eager' : 'lazy'"
      @error="ok = false"
    />
    <div
      v-else
      class="w-full h-full flex items-end p-4 font-mono text-[11px] tracking-widest3 uppercase text-secondaryDark"
      style="background-image: repeating-linear-gradient(135deg, #d8cdbb 0 12px, #ccc0ad 12px 24px);"
    >
      {{ label || 'image' }}
    </div>
  </div>
</template>
