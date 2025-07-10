<script setup lang="ts">
import { ref } from 'vue';
import emailjs from '@emailjs/browser';
import HalfHero from "../organisms/HalfHero.vue";
import YazIcon from "../atoms/YazIcon.vue";
import YazButton from "../atoms/YazButton.vue";
import ContactInfos from "../organisms/ContactInfos.vue";

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
  <section class="contact">
    <HalfHero
      image="windmillshorizontal.jpg"
      imagePosition="left"
    >
      <div class="flex flex-col w-full justify-center gap-8 px-4 py-6">
        <h2 class="text-3xl font-raleway font-light">
          {{ $t('pages.contact.title') }}
        </h2>

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
          <div
            v-if="errorMessage"
            class="font-raleway text-sm font-light"
          >
            {{ errorMessage }}
          </div>
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
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
          </div>

          <div class="space-y-2">
            <label
              for="email"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.email') }}</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
          </div>

          <div class="space-y-2">
            <label
              for="subject"
              class="font-raleway text-base font-light"
            >{{ $t('pages.contact.subject') || 'Subject' }}</label>
            <input
              type="text"
              id="subject"
              v-model="formData.subject"
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
          </div>

          <div class="space-y-2">
            <label
              for="message"
              class="block text-sm font-medium"
            >{{ $t('pages.contact.message') || 'Message' }}</label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="6"
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <div>
            <YazButton
              :label="isSubmitting ? $t('pages.contact.sending') : $t('pages.contact.send')"
              class="w-fit"
              type="primary"
            />
          </div>
        </form>

        <ContactInfos />
      </div>
    </HalfHero>
  </section>
</template>
