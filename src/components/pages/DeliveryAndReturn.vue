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
    :eyebrow="$t('footer.deliveryAndReturn')"
    :title="$t('deliveryAndReturn.title')"
    :lede="isTr ? 'Hizmet teslimi, iade koşulları ve mücbir sebep durumlarına ilişkin koşullar.' : 'Service delivery, refund conditions, and force majeure terms.'"
    :last-updated="$t('deliveryAndReturn.lastUpdated')"
  >
    <LegalSection index="01" :title="$t('deliveryAndReturn.serviceDeliveryTitle')">
      <p class="m-0">{{ $t('deliveryAndReturn.serviceDeliveryContent') }}</p>
    </LegalSection>

    <LegalSection index="02" :title="$t('deliveryAndReturn.checkInOutTitle')">
      <p class="m-0">{{ $t('deliveryAndReturn.checkInOutContent') }}</p>
    </LegalSection>

    <LegalSection index="03" :title="$t('deliveryAndReturn.refundTitle')">
      <ul class="list-none m-0 p-0">
        <li class="flex items-start gap-4 py-3 border-t border-ink/10 first:border-t-0">
          <span class="font-display italic text-peach mt-1 leading-none" style="font-size: 22px;">·</span>
          <p class="m-0">{{ $t('deliveryAndReturn.refundFree') }}</p>
        </li>
        <li class="flex items-start gap-4 py-3 border-t border-ink/10">
          <span class="font-display italic text-peach mt-1 leading-none" style="font-size: 22px;">·</span>
          <p class="m-0">{{ $t('deliveryAndReturn.refundPartial') }}</p>
        </li>
        <li class="flex items-start gap-4 py-3 border-t border-ink/10">
          <span class="font-display italic text-peach mt-1 leading-none" style="font-size: 22px;">·</span>
          <p class="m-0">{{ $t('deliveryAndReturn.refundLate') }}</p>
        </li>
      </ul>
    </LegalSection>

    <LegalSection index="04" :title="$t('deliveryAndReturn.refundProcessTitle')">
      <p class="m-0">{{ $t('deliveryAndReturn.refundProcessContent') }}</p>
    </LegalSection>

    <LegalSection index="05" :title="$t('deliveryAndReturn.forceMajeureTitle')">
      <p class="m-0">{{ $t('deliveryAndReturn.forceMajeureContent') }}</p>
    </LegalSection>

    <LegalSection index="06" :title="$t('deliveryAndReturn.contactTitle')">
      <p class="mb-4">{{ $t('deliveryAndReturn.contactContent') }}</p>
      <div class="flex flex-col gap-1">
        <a href="mailto:info@yaz-evi.com" class="font-display italic text-[20px] md:text-[22px] text-ink no-underline w-fit">info@yaz-evi.com</a>
        <a href="tel:+905324316734" class="font-display italic text-[20px] md:text-[22px] text-ink no-underline w-fit">0532 431 67 34</a>
      </div>
    </LegalSection>
  </LegalPage>
</template>
