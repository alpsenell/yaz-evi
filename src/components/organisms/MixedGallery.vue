<template>
  <section class="mixed-gallery max-w-screen-lg flex flex-col md:flex-row items-center mx-auto gap-6 my-10 px-4 md:px-0">
    <div class="flex flex-col items-start md:items-end gap-4">
      <slot name="left"/>
    </div>
    <div class="md:mt-10 flex flex-col items-start gap-4">
      <slot name="right"/>
    </div>
  </section>
</template>
