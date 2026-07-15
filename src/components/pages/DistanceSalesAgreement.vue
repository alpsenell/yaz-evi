<script setup lang="ts">
import PolicyPage from '../organisms/PolicyPage.vue'

const sections = [
  { heading: 'distanceSales.partiesTitle', paragraphs: ['distanceSales.sellerTitle', 'distanceSales.sellerName', 'distanceSales.sellerAddress', 'distanceSales.sellerPhone', 'distanceSales.sellerEmail'] },
  { heading: 'distanceSales.subjectTitle', paragraphs: ['distanceSales.subjectContent'] },
  { heading: 'distanceSales.serviceDetailsTitle', paragraphs: ['distanceSales.serviceDetailsContent'] },
  { heading: 'distanceSales.priceTitle', paragraphs: ['distanceSales.priceContent'] },
  { heading: 'distanceSales.withdrawalTitle', paragraphs: ['distanceSales.withdrawalContent'] },
  { heading: 'distanceSales.cancellationTitle', paragraphs: ['distanceSales.cancellationContent'] },
  { heading: 'distanceSales.responsibilitiesTitle', paragraphs: ['distanceSales.responsibilitiesContent'] },
  { heading: 'distanceSales.disputeTitle', paragraphs: ['distanceSales.disputeContent'] },
  { heading: 'v2.policy.acceptance', paragraphs: ['distanceSales.acceptanceContent'] },
]
</script>

<template>
  <PolicyPage
    title-key="distanceSales.title"
    :sections="sections"
    updated-key="distanceSales.lastUpdated"
  />
</template>
