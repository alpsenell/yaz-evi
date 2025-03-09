<template>
 <div class="loader w-12 rounded-full border-8 border-solid"></div>
</template>

<style scoped lang="scss">
.loader {
  aspect-ratio: 1;
  border-color: #3E2021 #0000;
  animation: l1 1s infinite;
}
@keyframes l1 {to{transform: rotate(.5turn)}}
</style>
