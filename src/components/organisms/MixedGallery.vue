<template>
  <section class="mixed-gallery max-w-screen-lg mx-auto gap-6 my-10">
    <div class="flex flex-col items-end gap-4">
      <slot name="left"/>
    </div>
    <div class="mt-10 flex flex-col items-start gap-4">
      <slot name="right"/>
    </div>
  </section>
</template>
