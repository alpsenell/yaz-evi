<script setup lang="ts">
import PolicyPage from '../organisms/PolicyPage.vue'

const sections = [
  { heading: 'deliveryAndReturn.serviceDeliveryTitle', paragraphs: ['deliveryAndReturn.serviceDeliveryContent'] },
  { heading: 'deliveryAndReturn.checkInOutTitle', paragraphs: ['deliveryAndReturn.checkInOutContent'] },
  { heading: 'deliveryAndReturn.refundTitle', paragraphs: ['deliveryAndReturn.refundFree', 'deliveryAndReturn.refundPartial', 'deliveryAndReturn.refundLate'] },
  { heading: 'deliveryAndReturn.refundProcessTitle', paragraphs: ['deliveryAndReturn.refundProcessContent'] },
  { heading: 'deliveryAndReturn.forceMajeureTitle', paragraphs: ['deliveryAndReturn.forceMajeureContent'] },
  { heading: 'deliveryAndReturn.contactTitle', paragraphs: ['deliveryAndReturn.contactContent'] },
]
</script>

<template>
  <PolicyPage
    title-key="deliveryAndReturn.title"
    :sections="sections"
    updated-key="deliveryAndReturn.lastUpdated"
  />
</template>
