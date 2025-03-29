<script setup lang="ts">
import HalfHero from "../organisms/HalfHero.vue";
import YazButton from "../atoms/YazButton.vue";
import { ref } from "vue";
import emailjs from '@emailjs/browser';

const formData = ref({
  name: "",
  email: "",
  message: "",
});

const loading = ref(false);
const success = ref(false);
const error = ref("");

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = "";
    success.value = false;

    // Send email using EmailJS
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: formData.value.name,
        from_email: formData.value.email,
        message: formData.value.message,
      },
      import.meta.env.VITE_EMAILJS_USER_ID
    );

    // Reset form
    formData.value = {
      name: "",
      email: "",
      message: "",
    };
    success.value = true;
  } catch (err) {
    console.error("Error sending email:", err);
    error.value = "An error occurred while sending the message. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="contact">
    <HalfHero
      :description="$t('pages.contact.intro')"
      image="contact-hero.webp"
      imagePosition="left"
    />

    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="bg-white p-8 rounded-lg shadow-lg">
          <h2 class="font-raleway text-3xl mb-6">{{ $t('pages.contact.formTitle') }}</h2>
          
          <!-- Success Message -->
          <div v-if="success" class="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            {{ $t('pages.contact.successMessage') }}
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('pages.contact.name') }}
              </label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('pages.contact.email') }}
              </label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('pages.contact.message') }}
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              ></textarea>
            </div>
            <YazButton
              type="primary"
              :label="loading ? $t('pages.contact.submitting') : $t('pages.contact.submit')"
              class="w-full"
              :disabled="loading"
            />
          </form>
        </div>

        <!-- Contact Information -->
        <div class="space-y-8">
          <div>
            <h3 class="font-raleway text-2xl mb-4">{{ $t('pages.contact.contactInfo') }}</h3>
            <div class="space-y-4">
              <p class="flex items-center">
                <span class="mr-2">📍</span>
                {{ $t('pages.contact.address') }}
              </p>
              <p class="flex items-center">
                <span class="mr-2">📞</span>
                {{ $t('pages.contact.phone') }}
              </p>
              <p class="flex items-center">
                <span class="mr-2">✉️</span>
                {{ $t('pages.contact.email') }}
              </p>
            </div>
          </div>

          <div>
            <h3 class="font-raleway text-2xl mb-4">{{ $t('pages.contact.businessHours') }}</h3>
            <div class="space-y-2">
              <p>{{ $t('pages.contact.weekdays') }}</p>
              <p>{{ $t('pages.contact.weekends') }}</p>
            </div>
          </div>

          <div>
            <h3 class="font-raleway text-2xl mb-4">{{ $t('pages.contact.socialMedia') }}</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-600 hover:text-blue-500">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.09 1.064.077 1.791.232 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.233.636.388 1.363.465 2.427.077 1.067.09 1.407.09 4.123v.08c0 2.643-.012 2.987-.09 4.043-.077 1.064-.232 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.233-1.363.388-2.427.465-1.067.077-1.407.09-4.123.09h-.08c-2.643 0-2.987-.012-4.043-.09-1.064-.077-1.791-.232-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.233-.636-.388-1.363-.465-2.427-.077-1.022-.087-1.379-.087-4.123v-.08c0-2.643.012-2.987.09-4.043.077-1.064.232-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.233 1.363-.388 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-600 hover:text-blue-500">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  @apply bg-gray-50;
}
</style>
