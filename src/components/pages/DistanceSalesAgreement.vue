<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import LegalPage from '../organisms/LegalPage.vue';
import LegalSection from '../organisms/LegalSection.vue';

const { i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));
</script>

<template>
  <LegalPage
    :eyebrow="$t('footer.distanceSales')"
    :title="$t('distanceSales.title')"
    :lede="isTr ? 'Mesafeli rezervasyon sözleşmesinin tarafları, hizmet kapsamı, ödeme ve cayma hakkı koşulları.' : 'Parties, scope of service, payment, and right of withdrawal under the distance reservation agreement.'"
    :last-updated="$t('distanceSales.lastUpdated')"
  >
    <LegalSection index="01" :title="$t('distanceSales.partiesTitle')">
      <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-3 font-semibold">{{ $t('distanceSales.sellerTitle') }}</div>
      <p class="m-0 mb-1 font-display italic text-[20px] md:text-[22px]">{{ $t('distanceSales.sellerName') }}</p>
      <p class="m-0">{{ $t('distanceSales.sellerAddress') }}</p>
      <p class="m-0">{{ $t('distanceSales.sellerPhone') }}</p>
      <p class="m-0">{{ $t('distanceSales.sellerEmail') }}</p>
    </LegalSection>

    <LegalSection index="02" :title="$t('distanceSales.subjectTitle')">
      <p class="m-0">{{ $t('distanceSales.subjectContent') }}</p>
    </LegalSection>

    <LegalSection index="03" :title="$t('distanceSales.serviceDetailsTitle')">
      <p class="m-0">{{ $t('distanceSales.serviceDetailsContent') }}</p>
    </LegalSection>

    <LegalSection index="04" :title="$t('distanceSales.priceTitle')">
      <p class="m-0">{{ $t('distanceSales.priceContent') }}</p>
    </LegalSection>

    <LegalSection index="05" :title="$t('distanceSales.withdrawalTitle')">
      <p class="m-0">{{ $t('distanceSales.withdrawalContent') }}</p>
    </LegalSection>

    <LegalSection index="06" :title="$t('distanceSales.cancellationTitle')">
      <p class="m-0">{{ $t('distanceSales.cancellationContent') }}</p>
    </LegalSection>

    <LegalSection index="07" :title="$t('distanceSales.responsibilitiesTitle')">
      <p class="m-0">{{ $t('distanceSales.responsibilitiesContent') }}</p>
    </LegalSection>

    <LegalSection index="08" :title="$t('distanceSales.disputeTitle')">
      <p class="m-0">{{ $t('distanceSales.disputeContent') }}</p>
    </LegalSection>

    <div class="py-10 md:py-12 border-t border-ink/12 font-display italic text-[20px] md:text-[24px] leading-[1.4] text-muted">
      {{ $t('distanceSales.acceptanceContent') }}
    </div>
  </LegalPage>
</template>
