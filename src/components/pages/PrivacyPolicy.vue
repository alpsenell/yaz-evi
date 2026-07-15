<script setup lang="ts">
import PolicyPage from '../organisms/PolicyPage.vue'

const sections = [
  { heading: 'privacyPolicy.dataControllerTitle', paragraphs: ['privacyPolicy.dataControllerContent'] },
  { heading: 'privacyPolicy.collectedDataTitle', paragraphs: ['privacyPolicy.collectedDataContent'] },
  { heading: 'privacyPolicy.purposeTitle', paragraphs: ['privacyPolicy.purposeContent'] },
  { heading: 'privacyPolicy.dataSharingTitle', paragraphs: ['privacyPolicy.dataSharingContent'] },
  { heading: 'privacyPolicy.cookiesTitle', paragraphs: ['privacyPolicy.cookiesContent'] },
  { heading: 'privacyPolicy.dataSecurityTitle', paragraphs: ['privacyPolicy.dataSecurityContent'] },
  { heading: 'privacyPolicy.userRightsTitle', paragraphs: ['privacyPolicy.userRightsContent'] },
  { heading: 'privacyPolicy.contactTitle', paragraphs: ['privacyPolicy.contactContent'] },
]
</script>

<template>
  <PolicyPage
    title-key="privacyPolicy.title"
    :sections="sections"
    updated-key="privacyPolicy.lastUpdated"
  />
</template>
