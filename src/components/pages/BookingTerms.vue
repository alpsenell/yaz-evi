<script setup lang="ts">
import PolicyPage from '../organisms/PolicyPage.vue'

const sections = [
  { heading: 'bookingTerms.reservationTermsTitle', paragraphs: ['bookingTerms.reservationTermsContent'] },
  { heading: 'bookingTerms.cancellationTitle', paragraphs: ['bookingTerms.cancellationFree', 'bookingTerms.cancellationPartial', 'bookingTerms.cancellationLate', 'bookingTerms.cancellationNoShow'] },
  { heading: 'bookingTerms.checkInOutTitle', paragraphs: ['bookingTerms.checkInOutContent'] },
  { heading: 'bookingTerms.guestResponsibilitiesTitle', paragraphs: ['bookingTerms.guestResponsibilitiesContent'] },
  { heading: 'bookingTerms.privacyTitle', paragraphs: ['bookingTerms.privacyContent'] },
  { heading: 'bookingTerms.contactTitle', paragraphs: ['bookingTerms.contactContent'] },
]
</script>

<template>
  <PolicyPage
    title-key="bookingTerms.title"
    :sections="sections"
    updated-key="bookingTerms.lastUpdated"
  />
</template>
