<script setup lang="ts">
import { defineProps } from 'vue'
import { c } from "vite/dist/node/types.d-aGj9QkWt";

defineProps({
  name: String,
  size: Number,
  color: String,
})
</script>

<template>
  <div>
    <svg
      v-if="name === 'phone'"
      :fill="color"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      :height="size"
      :width="size"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M11.748 5.773S11.418 5 10.914 5c-.496 0-.754.229-.926.387S6.938 7.91 6.938 7.91s-.837.731-.773 2.106c.054 1.375.323 3.332 1.719 6.058 1.386 2.72 4.855 6.876 7.047 8.337 0 0 2.031 1.558 3.921 2.191.549.173 1.647.398 1.903.398.26 0 .719 0 1.246-.385.536-.389 3.543-2.807 3.543-2.807s.736-.665-.119-1.438c-.859-.773-3.467-2.492-4.025-2.944-.559-.459-1.355-.257-1.699.054-.343.313-.956.828-1.031.893-.112.086-.419.365-.763.226-.438-.173-2.234-1.148-3.899-3.426-1.655-2.276-1.837-3.02-2.084-3.824a.56.56 0 0 1 .225-.657c.248-.172 1.161-.933 1.161-.933s.591-.583.344-1.27-1.906-4.716-1.906-4.716z"></path>
      </g>
    </svg>

    <svg
      v-if="name === 'mail'"
      :fill="color"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      :height="size"
      :width="size"
    >
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M2.54433 5.16792C3.0468 4.46923 3.86451 4 4.8 4H19.2C20.1355 4 20.9532 4.46923 21.4557 5.16792C21.7993 5.64567 22 6.235 22 6.86667V17.1333C22 18.682 20.7804 20 19.2 20H4.8C3.21964 20 2 18.682 2 17.1333V6.86667C2 6.23499 2.20074 5.64567 2.54433 5.16792ZM4.9327 6L11.2598 12.9647C11.6566 13.4015 12.3434 13.4015 12.7402 12.9647L19.0673 6H4.9327ZM20 7.94766L14.2205 14.3096C13.0301 15.6199 10.9699 15.6199 9.77948 14.3096L4 7.94766V17.1333C4 17.6466 4.39214 18 4.8 18H19.2C19.6079 18 20 17.6466 20 17.1333V7.94766Z"/>
    </svg>

    <svg
      v-if="name === 'maps'"
      fill="none"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      :height="size"
      :width="size"
    >
      <path :stroke="color" stroke-width="12"
            d="M96 22a51.88 51.88 0 0 0-36.77 15.303A52.368 52.368 0 0 0 44 74.246c0 16.596 4.296 28.669 20.811 48.898a163.733 163.733 0 0 1 20.053 28.38C90.852 163.721 90.146 172 96 172c5.854 0 5.148-8.279 11.136-20.476a163.723 163.723 0 0 1 20.053-28.38C143.704 102.915 148 90.841 148 74.246a52.37 52.37 0 0 0-15.23-36.943A51.88 51.88 0 0 0 96 22Z"/>
      <circle cx="96" cy="74" r="20" :stroke="color" stroke-width="12"/>
    </svg>

    <svg
      v-if="name === 'down'"
      xmlns="http://www.w3.org/2000/svg"
      :height="size"
      :width="size"
      viewBox="0 0 10 6"
      fill="none"
    >
      <path d="M9 0.5L5 4.5L1 0.5" :stroke="color" stroke-linecap="round"/>
    </svg>

    <svg
      v-if="name === 'up'"
      xmlns="http://www.w3.org/2000/svg"
      :height="size"
      :width="size"
      viewBox="0 0 10 6"
      fill="none"
    >
      <path d="M1 5.5L5 1.5L9 5.5" :stroke="color" stroke-linecap="round"/>
    </svg>
  </div>
</template>

