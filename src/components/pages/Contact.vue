<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import i18next from 'i18next';
import { useTranslation } from 'i18next-vue';
import HalfHero from "../organisms/HalfHero.vue";
import YazButton from "../atoms/YazButton.vue";
import ContactInfos from "../organisms/ContactInfos.vue";
import { trackEvent } from '../../utils/analytics';
import { emailRegex, turkishPhoneRegex, formatTurkishPhone } from '../../utils/validation';

const { t } = useTranslation();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
  website: '', // honeypot — real users never see or fill this
});

const touched = ref({
  name: false,
  email: false,
  phone: false,
  message: false,
});

const submitAttempted = ref(false);
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);

const isPhoneEmpty = computed(() => {
  const trimmed = formData.value.phone.trim();
  return trimmed === '' || trimmed === '+90';
});

const errors = computed(() => ({
  name: formData.value.name.trim() === '' ? t('validation.nameRequired') : '',
  email: formData.value.email.trim() === ''
    ? t('validation.emailRequired')
    : !emailRegex.test(formData.value.email.trim())
      ? t('validation.emailInvalid')
      : '',
  phone: !isPhoneEmpty.value && !turkishPhoneRegex.test(formData.value.phone.trim())
    ? t('validation.phoneInvalid')
    : '',
  message: formData.value.message.trim() === '' ? t('validation.messageRequired') : '',
}));

const isFormValid = computed(() => Object.values(errors.value).every(e => e === ''));

const shouldShowError = (field: keyof typeof touched.value) => {
  return (touched.value[field] || submitAttempted.value) && errors.value[field];
};

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formatted = formatTurkishPhone(input.value);
  formData.value.phone = formatted;
  nextTick(() => {
    input.value = formatted;
  });
};

const sendEmail = async () => {
  if (isSubmitting.value) return;
  trackEvent('submitContactForm');
  submitAttempted.value = true;
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitSuccess.value = false;
  submitError.value = false;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.value.name.trim(),
        email: formData.value.email.trim(),
        phone: isPhoneEmpty.value ? '' : formData.value.phone.trim(),
        message: formData.value.message.trim(),
        locale: i18next.language,
        website: formData.value.website,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    trackEvent('submitContactFormSuccess');
    submitSuccess.value = true;
    formData.value = { name: '', email: '', phone: '', message: '', website: '' };
    touched.value = { name: false, email: false, phone: false, message: false };
    submitAttempted.value = false;
  } catch (error) {
    trackEvent('submitContactFormError');
    submitError.value = true;
    console.error('Contact form submission failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="contact">
    <HalfHero
      image="windmillshorizontal.jpg"
      imagePosition="left"
    >
      <div class="flex flex-col w-full justify-center gap-8 px-4 py-6">
        <h1 class="text-3xl font-raleway font-light">
          {{ $t('pages.contact.title') }}
        </h1>

        <div
          v-if="submitSuccess"
          class="font-raleway text-base font-light"
        >
          {{ $t('pages.contact.successMessage') }}
        </div>

        <div
          v-if="submitError"
          class="font-raleway text-base font-light text-red-500"
        >
          {{ $t('pages.contact.errorMessage') }}
        </div>

        <form
          @submit.prevent="sendEmail"
          class="flex flex-col gap-4"
        >
          <div class="flex flex-col gap-2">
            <label
              for="name"
              class="font-raleway text-base font-light"
            >
              {{ $t('pages.contact.name') }}
            </label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              @blur="touched.name = true"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('name') }"
            >
            <p
              v-if="shouldShowError('name')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.name }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="email"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.email') }}</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              @blur="touched.email = true"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('email') }"
            >
            <p
              v-if="shouldShowError('email')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.email }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="phone"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.phone') }} {{ $t('pages.contact.phoneOptional') }}</label>
            <input
              type="tel"
              id="phone"
              :value="formData.phone"
              @input="handlePhoneInput"
              @blur="touched.phone = true"
              placeholder="+90 (5__) ___ __ __"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('phone') }"
            >
            <p
              v-if="shouldShowError('phone')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.phone }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="message"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.message') }}</label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="6"
              @blur="touched.message = true"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': shouldShowError('message') }"
            ></textarea>
            <p
              v-if="shouldShowError('message')"
              class="font-raleway text-xs text-red-500"
            >
              {{ errors.message }}
            </p>
          </div>

          <input
            type="text"
            name="website"
            v-model="formData.website"
            class="hidden"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          >

          <div>
            <YazButton
              :label="isSubmitting ? $t('pages.contact.sending') : $t('pages.contact.send')"
              class="w-fit"
              type="primary"
              :disabled="isSubmitting"
            />
          </div>
        </form>

        <ContactInfos track-context="ContactPage" />
      </div>
    </HalfHero>
  </section>
</template>
