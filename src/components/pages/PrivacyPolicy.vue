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
    :eyebrow="$t('footer.privacyPolicy')"
    :title="$t('privacyPolicy.title')"
    :lede="isTr ? 'Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğuna dair açıklama.' : 'How your personal data is collected, used, and protected.'"
    :last-updated="$t('privacyPolicy.lastUpdated')"
  >
    <LegalSection index="01" :title="$t('privacyPolicy.dataControllerTitle')">
      <p class="m-0">{{ $t('privacyPolicy.dataControllerContent') }}</p>
    </LegalSection>

    <LegalSection index="02" :title="$t('privacyPolicy.collectedDataTitle')">
      <p class="m-0">{{ $t('privacyPolicy.collectedDataContent') }}</p>
    </LegalSection>

    <LegalSection index="03" :title="$t('privacyPolicy.purposeTitle')">
      <p class="m-0">{{ $t('privacyPolicy.purposeContent') }}</p>
    </LegalSection>

    <LegalSection index="04" :title="$t('privacyPolicy.dataSharingTitle')">
      <p class="m-0">{{ $t('privacyPolicy.dataSharingContent') }}</p>
    </LegalSection>

    <LegalSection index="05" :title="$t('privacyPolicy.cookiesTitle')">
      <p class="m-0">{{ $t('privacyPolicy.cookiesContent') }}</p>
    </LegalSection>

    <LegalSection index="06" :title="$t('privacyPolicy.dataSecurityTitle')">
      <p class="m-0">{{ $t('privacyPolicy.dataSecurityContent') }}</p>
    </LegalSection>

    <LegalSection index="07" :title="$t('privacyPolicy.userRightsTitle')">
      <p class="m-0">{{ $t('privacyPolicy.userRightsContent') }}</p>
    </LegalSection>

    <LegalSection index="08" :title="$t('privacyPolicy.contactTitle')">
      <p class="mb-4">{{ $t('privacyPolicy.contactContent') }}</p>
      <div class="flex flex-col gap-1">
        <a href="mailto:info@yaz-evi.com" class="font-display italic text-[20px] md:text-[22px] text-ink no-underline w-fit">info@yaz-evi.com</a>
        <a href="tel:+905324316734" class="font-display italic text-[20px] md:text-[22px] text-ink no-underline w-fit">0532 431 67 34</a>
      </div>
    </LegalSection>
  </LegalPage>
</template>
