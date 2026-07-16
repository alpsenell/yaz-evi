<template>
  <main class="not-found page-fade bg-cream min-h-screen flex items-center justify-center px-6">
    <div class="text-center max-w-[560px] pt-[120px] pb-[80px]">
      <div class="eyebrow mb-5">{{ $t('v2.notFound.eyebrow') }}</div>
      <h1 class="font-serif font-light text-[64px] md:text-[92px] leading-none text-ink mt-0 mb-6">404</h1>
      <p class="font-serif italic text-[22px] text-azure mt-0 mb-4">{{ $t('v2.notFound.title') }}</p>
      <p class="body-p mb-8">{{ $t('v2.notFound.body') }}</p>
      <router-link to="/" class="btn-solid-ink inline-block">{{ $t('v2.notFound.back') }}</router-link>
    </div>
  </main>
</template>
