<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import LegalPage from '../organisms/LegalPage.vue';
import LegalSection from '../organisms/LegalSection.vue';

const { t, i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));
</script>

<template>
  <LegalPage
    :eyebrow="$t('footer.termsAndPolicy')"
    :title="$t('bookingTerms.title')"
    :lede="isTr ? 'Rezervasyon, iptal ve giriş–çıkış koşulları için kısa bir okuma.' : 'A short read on reservation, cancellation, and check-in / check-out terms.'"
    :last-updated="$t('bookingTerms.lastUpdated')"
  >
    <LegalSection index="01" :title="$t('bookingTerms.reservationTermsTitle')">
      <p class="m-0">{{ $t('bookingTerms.reservationTermsContent') }}</p>
    </LegalSection>

    <LegalSection index="02" :title="$t('bookingTerms.cancellationTitle')">
      <ul class="list-none m-0 p-0">
        <li class="flex items-start gap-4 py-3 border-t border-ink/10 first:border-t-0">
          <span class="font-display italic text-peach mt-1 leading-none" style="font-size: 22px;">·</span>
          <p class="m-0">{{ $t('bookingTerms.cancellationFree') }}</p>
        </li>
        <li class="flex items-start gap-4 py-3 border-t border-ink/10">
          <span class="font-display italic text-peach mt-1 leading-none" style="font-size: 22px;">·</span>
          <p class="m-0">{{ $t('bookingTerms.cancellationPartial') }}</p>
        </li>
        <li class="flex items-start gap-4 py-3 border-t border-ink/10">
          <span class="font-display italic text-peach mt-1 leading-none" style="font-size: 22px;">·</span>
          <p class="m-0">{{ $t('bookingTerms.cancellationLate') }}</p>
        </li>
        <li class="flex items-start gap-4 py-3 border-t border-ink/10">
          <span class="font-display italic text-peach mt-1 leading-none" style="font-size: 22px;">·</span>
          <p class="m-0">{{ $t('bookingTerms.cancellationNoShow') }}</p>
        </li>
      </ul>
    </LegalSection>

    <LegalSection index="03" :title="$t('bookingTerms.checkInOutTitle')">
      <p class="m-0">{{ $t('bookingTerms.checkInOutContent') }}</p>
    </LegalSection>

    <LegalSection index="04" :title="$t('bookingTerms.guestResponsibilitiesTitle')">
      <p class="m-0">{{ $t('bookingTerms.guestResponsibilitiesContent') }}</p>
    </LegalSection>

    <LegalSection index="05" :title="$t('bookingTerms.privacyTitle')">
      <p class="m-0">{{ $t('bookingTerms.privacyContent') }}</p>
    </LegalSection>

    <LegalSection index="06" :title="$t('bookingTerms.contactTitle')">
      <p class="mb-4">{{ $t('bookingTerms.contactContent') }}</p>
      <div class="flex flex-col gap-1">
        <a href="mailto:info@yaz-evi.com" class="font-display italic text-[20px] md:text-[22px] text-ink no-underline w-fit">info@yaz-evi.com</a>
        <a href="tel:+905324316734" class="font-display italic text-[20px] md:text-[22px] text-ink no-underline w-fit">0532 431 67 34</a>
      </div>
    </LegalSection>
  </LegalPage>
</template>
