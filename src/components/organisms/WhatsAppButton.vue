<script setup lang="ts">
import i18next from 'i18next'
import { buildWhatsAppUrl, buildBookingWhatsAppText } from '../../utils/whatsapp'
import { trackEvent } from '../../utils/analytics'
import YazIcon from '../atoms/YazIcon.vue'

// Re-evaluated on render; the reactive $t in the template re-renders this
// component on language change, so the prefilled message stays in sync.
function whatsappHref() {
  return buildWhatsAppUrl(buildBookingWhatsAppText({}, i18next.language))
}

function onClick() {
  trackEvent('whatsapp_float_clicked')
}
</script>

<template>
  <a
    :href="whatsappHref()"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="$t('whatsapp.ariaLabel')"
    class="fixed z-40 bottom-20 right-4 md:bottom-6 md:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] focus-visible:outline-none"
    @click="onClick"
  >
    <YazIcon name="whatsapp" :size="30" color="#ffffff" />
  </a>
</template>
