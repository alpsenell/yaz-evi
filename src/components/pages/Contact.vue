<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import i18next from 'i18next';
import { useTranslation } from 'i18next-vue';
import { getMediaUrl } from '../../utils/media';
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
  <main class="contact page-fade bg-cream">
    <div class="grid grid-cols-1 md:grid-cols-2 min-h-0 md:min-h-[760px]">
      <!-- Form -->
      <div class="px-6 md:px-14 pt-[120px] md:pt-[150px] pb-[70px] order-2 md:order-1">
        <div class="eyebrow mb-5">{{ $t('v2.contact.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[40px] md:text-[56px] leading-[1.08] text-ink mt-0 mb-6">{{ $t('v2.getInTouch') }}</h1>
        <p class="body-p max-w-[460px] mb-6">{{ $t('v2.contact.body') }}</p>

        <div
          v-if="submitSuccess"
          class="font-jost text-sm text-azure border border-azure px-5 py-4 mb-5 max-w-[460px]"
        >
          {{ $t('v2.contact.sent') }}
        </div>

        <div
          v-if="submitError"
          class="font-jost text-sm text-red-600 border border-red-400 px-5 py-4 mb-5 max-w-[460px]"
        >
          {{ $t('pages.contact.errorMessage') }}
        </div>

        <form
          @submit.prevent="sendEmail"
          class="flex flex-col gap-6 max-w-[460px]"
        >
          <div>
            <label for="name" class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5">
              {{ $t('pages.contact.name') }}
            </label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              @blur="touched.name = true"
              class="w-full border-0 border-b bg-transparent py-2 font-jost text-base text-ink outline-none rounded-none"
              :class="shouldShowError('name') ? 'border-red-500' : 'border-[#C9BDA4] focus:border-azure'"
            >
            <p
              v-if="shouldShowError('name')"
              class="font-jost text-xs text-red-600 mt-1.5 mb-0"
            >
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label for="email" class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5">
              {{ $t('pages.contact.email') }}
            </label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              @blur="touched.email = true"
              class="w-full border-0 border-b bg-transparent py-2 font-jost text-base text-ink outline-none rounded-none"
              :class="shouldShowError('email') ? 'border-red-500' : 'border-[#C9BDA4] focus:border-azure'"
            >
            <p
              v-if="shouldShowError('email')"
              class="font-jost text-xs text-red-600 mt-1.5 mb-0"
            >
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="phone" class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5">
              {{ $t('pages.contact.phone') }} {{ $t('pages.contact.phoneOptional') }}
            </label>
            <input
              type="tel"
              id="phone"
              :value="formData.phone"
              @input="handlePhoneInput"
              @blur="touched.phone = true"
              placeholder="+90 (5__) ___ __ __"
              class="w-full border-0 border-b bg-transparent py-2 font-jost text-base text-ink outline-none rounded-none placeholder:text-stone"
              :class="shouldShowError('phone') ? 'border-red-500' : 'border-[#C9BDA4] focus:border-azure'"
            >
            <p
              v-if="shouldShowError('phone')"
              class="font-jost text-xs text-red-600 mt-1.5 mb-0"
            >
              {{ errors.phone }}
            </p>
          </div>

          <div>
            <label for="message" class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5">
              {{ $t('pages.contact.message') }}
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="5"
              @blur="touched.message = true"
              class="w-full border bg-transparent p-3 font-jost text-[15px] text-ink outline-none resize-y min-h-[110px] rounded-none"
              :class="shouldShowError('message') ? 'border-red-500' : 'border-[#C9BDA4] focus:border-azure'"
            ></textarea>
            <p
              v-if="shouldShowError('message')"
              class="font-jost text-xs text-red-600 mt-1.5 mb-0"
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

          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-solid-ink border-none w-full disabled:opacity-60"
          >
            {{ isSubmitting ? $t('pages.contact.sending') : $t('v2.send') }}
          </button>
        </form>
      </div>

      <!-- Image with contact info -->
      <div class="relative h-[420px] md:h-auto order-1 md:order-2">
        <img
          :src="getMediaUrl('windmillshorizontal.jpg')"
          alt="Bozcaada windmills"
          class="absolute inset-0 w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.15)] to-[rgba(16,32,40,0.6)]"></div>
        <div class="absolute left-6 md:left-10 bottom-8 md:bottom-11 text-white flex flex-col gap-4">
          <div class="mb-1">
            <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-[#cfe0e6] mb-2">{{ $t('v2.contact.phone') }}</div>
            <a href="tel:+905324316734" class="font-serif text-2xl" v-track="'clickOnContactPagePhone'">+90 532 431 67 34</a>
          </div>
          <div class="mb-1">
            <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-[#cfe0e6] mb-2">{{ $t('v2.contact.email') }}</div>
            <a href="mailto:info@yaz-evi.com" class="font-serif text-2xl" v-track="'clickOnContactPageEmail'">info@yaz-evi.com</a>
          </div>
          <div>
            <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-[#cfe0e6] mb-2">{{ $t('v2.contact.address') }}</div>
            <a
              href="https://maps.app.goo.gl/djGuToKY5A9Hmucp9"
              target="_blank"
              rel="noopener noreferrer"
              class="font-serif text-[22px] leading-[1.3]"
              v-track="'clickOnContactPageAddress'"
            >
              Alaybey Mah. Muratbey Sk. 12<br>Bozcaada / Çanakkale
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
