<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'

interface Props {
  type?: string
  label: string
  small?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
})

const classes = computed(() => {
  switch (props.type) {
    case 'primary':
      return 'bg-primary text-white'
    case 'secondary':
      return 'bg-secondary text-white'
    case 'outlined':
      return 'border border-primary text-primary'
    default:
      return ''
  }
})
</script>

<template>
  <button
    class="yaz-button font-raleway font-extralight text-base px-4 py-3 relative overflow-hidden"
    :class="`yaz-button__${props.type} ${classes}`"
  >
    {{ props.label }}
  </button>
</template>

<style scoped lang="scss">
.yaz-button {
  &__outlined  {
    &:after {
      transition: all .2s ease-in-out;
      position: absolute;
      top: 0;
      right: auto;
      bottom: auto;
      left: -100%;
      width: 100%;
      height: 100%;
      content: "";
      z-index: -1;
    }

    &:hover:after {
      left: 0;
      background-color: #a97057;
    }

    &:hover {
      color: #fff;
    }
  }
}
</style>
