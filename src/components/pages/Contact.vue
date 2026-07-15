<script setup lang="ts">
import { ref } from 'vue';
import emailjs from '@emailjs/browser';
import { getMediaUrl } from '../../utils/media';

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);
const errorMessage = ref('');

const sendEmail = async () => {
  isSubmitting.value = true;
  submitSuccess.value = false;
  submitError.value = false;

  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: 'info@yaz-evi.com',
        name: formData.value.name,
        email: formData.value.email,
        title: formData.value.subject,
        message: formData.value.message,
      },
      import.meta.env.VITE_EMAILJS_USER_ID
    );

    if (result.status === 200) {
      submitSuccess.value = true;
      formData.value = { name: '', email: '', subject: '', message: '' };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    submitError.value = true;
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Email sending failed:', error);
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
          <div v-if="errorMessage" class="text-xs mt-1">{{ errorMessage }}</div>
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
              required
              class="w-full border-0 border-b border-[#C9BDA4] bg-transparent py-2 font-jost text-base text-ink outline-none focus:border-azure rounded-none"
            >
          </div>

          <div>
            <label for="email" class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5">
              {{ $t('pages.contact.email') }}
            </label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              class="w-full border-0 border-b border-[#C9BDA4] bg-transparent py-2 font-jost text-base text-ink outline-none focus:border-azure rounded-none"
            >
          </div>

          <div>
            <label for="subject" class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5">
              {{ $t('pages.contact.subject') }}
            </label>
            <input
              type="text"
              id="subject"
              v-model="formData.subject"
              required
              class="w-full border-0 border-b border-[#C9BDA4] bg-transparent py-2 font-jost text-base text-ink outline-none focus:border-azure rounded-none"
            >
          </div>

          <div>
            <label for="message" class="block font-jost text-[11px] tracking-[0.24em] uppercase text-azure mb-2.5">
              {{ $t('pages.contact.message') }}
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="5"
              required
              class="w-full border border-[#C9BDA4] bg-transparent p-3 font-jost text-[15px] text-ink outline-none focus:border-azure resize-y min-h-[110px] rounded-none"
            ></textarea>
          </div>

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
            <a href="tel:+905324316734" class="font-serif text-2xl">+90 532 431 67 34</a>
          </div>
          <div class="mb-1">
            <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-[#cfe0e6] mb-2">{{ $t('v2.contact.email') }}</div>
            <a href="mailto:info@yaz-evi.com" class="font-serif text-2xl">info@yaz-evi.com</a>
          </div>
          <div>
            <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-[#cfe0e6] mb-2">{{ $t('v2.contact.address') }}</div>
            <a
              href="https://maps.app.goo.gl/djGuToKY5A9Hmucp9"
              target="_blank"
              rel="noopener noreferrer"
              class="font-serif text-[22px] leading-[1.3]"
            >
              Alaybey Mah. Muratbey Sk. 12<br>Bozcaada / Çanakkale
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
