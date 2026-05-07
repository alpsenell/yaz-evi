<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import emailjs from '@emailjs/browser';
import Eyebrow from '../atoms/Eyebrow.vue';

const { i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));

const formData = ref({ name: '', email: '', subject: '', message: '' });
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
      import.meta.env.VITE_EMAILJS_USER_ID,
    );
    if (result.status === 200) {
      submitSuccess.value = true;
      formData.value = { name: '', email: '', subject: '', message: '' };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (e) {
    submitError.value = true;
    errorMessage.value = e instanceof Error ? e.message : 'Unknown error';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="contact-editorial bg-cream text-ink font-raleway font-light">
    <section class="px-6 md:px-16 pt-16 md:pt-24 pb-12 md:pb-20">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-end">
        <h1
          class="md:col-span-7 font-display font-light leading-[0.9] m-0"
          style="font-size: clamp(80px, 14vw, 200px); letter-spacing: -0.03em;"
        >
          <span class="block">{{ $t('contactPage.titleLine1') }}</span>
          <span class="block italic text-peach" style="padding-left: 16%;">{{ $t('contactPage.titleLine2') }}</span>
        </h1>
        <div class="md:col-span-5">
          <Eyebrow class="mb-6">{{ $t('contactPage.eyebrow') }}</Eyebrow>
          <p class="text-[16px] leading-[1.7] opacity-80 m-0">{{ $t('contactPage.lede') }}</p>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-20 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
      <div class="md:col-span-7">
        <Eyebrow class="mb-10">{{ $t('contactPage.formTitle') }}</Eyebrow>

        <div v-if="submitSuccess" class="mb-6 p-4 border border-peach/40 bg-peach/10 text-[15px]">
          {{ $t('pages.contact.successMessage') }}
        </div>
        <div v-if="submitError" class="mb-6 p-4 border border-red-300 text-red-700 text-[15px]">
          {{ $t('pages.contact.errorMessage') }}
          <div v-if="errorMessage" class="text-[12px] mt-2 opacity-70">{{ errorMessage }}</div>
        </div>

        <form @submit.prevent="sendEmail" class="contact-form">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <label class="block mb-6">
              <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2 font-semibold">{{ $t('contactPage.name') }}</div>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full bg-transparent border-none border-b border-ink/30 py-3 text-[16px] text-ink outline-none"
                style="border-bottom: 1px solid rgba(31,22,20,0.3);"
              />
            </label>
            <label class="block mb-6">
              <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2 font-semibold">{{ $t('contactPage.email') }}</div>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full bg-transparent border-none py-3 text-[16px] text-ink outline-none"
                style="border-bottom: 1px solid rgba(31,22,20,0.3);"
              />
            </label>
          </div>
          <label class="block mb-6">
            <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2 font-semibold">{{ $t('contactPage.subject') }}</div>
            <input
              v-model="formData.subject"
              type="text"
              required
              class="w-full bg-transparent border-none py-3 text-[16px] text-ink outline-none"
              style="border-bottom: 1px solid rgba(31,22,20,0.3);"
            />
          </label>
          <label class="block mb-8">
            <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2 font-semibold">{{ $t('contactPage.message') }}</div>
            <textarea
              v-model="formData.message"
              rows="5"
              required
              class="w-full bg-transparent border-none py-3 text-[16px] text-ink outline-none resize-y font-raleway"
              style="border-bottom: 1px solid rgba(31,22,20,0.3);"
            ></textarea>
          </label>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-10 py-5 bg-ink text-cream rounded-full text-[12px] tracking-nav uppercase font-medium border-none cursor-pointer disabled:opacity-60"
          >
            {{ isSubmitting ? $t('pages.contact.sending') : $t('contactPage.send') }} →
          </button>
        </form>
      </div>

      <div class="md:col-span-5">
        <Eyebrow class="mb-10">{{ $t('contactPage.direct') }}</Eyebrow>
        <div class="py-6 border-t border-ink/20">
          <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2">{{ isTr ? 'Telefon' : 'Phone' }}</div>
          <a href="tel:+905303062021" class="font-display italic text-[26px] md:text-[28px] text-ink no-underline">+90 530 306 20 21</a>
        </div>
        <div class="py-6 border-t border-ink/20">
          <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2">{{ isTr ? 'E-posta' : 'Email' }}</div>
          <a href="mailto:info@yaz-evi.com" class="font-display italic text-[26px] md:text-[28px] text-ink no-underline">info@yaz-evi.com</a>
        </div>
        <div class="py-6 border-t border-ink/20">
          <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2">{{ isTr ? 'Adres' : 'Address' }}</div>
          <div class="font-display italic text-[20px] md:text-[22px] leading-[1.4] whitespace-pre-line">{{ isTr ? "Alaybey Mah.\nMuratbey Sk. 12\nBozcaada / Çanakkale" : "Alaybey Mah.\nMuratbey Sk. 12\nBozcaada / Çanakkale" }}</div>
        </div>
        <div class="py-6 border-t border-ink/20">
          <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2">{{ isTr ? 'Sezon' : 'Season' }}</div>
          <div class="font-display italic text-[20px] md:text-[22px]">{{ isTr ? 'Açık · Mayıs – Ekim' : 'Open · May – October' }}</div>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-24 md:pb-32">
      <div class="flex justify-between items-baseline mb-8">
        <h3 class="font-display font-light m-0" style="font-size: clamp(28px, 3.5vw, 36px); letter-spacing: -0.01em;">
          {{ isTr ? 'Harita' : 'Map' }}
        </h3>
        <span class="text-[11px] tracking-widest3 uppercase opacity-55 font-mono">{{ isTr ? '39.8346° K · 26.0407° D' : '39.8346° N · 26.0407° E' }}</span>
      </div>
      <div class="rounded-[4px] overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.824069050704!2d26.072010299999995!3d39.833362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b0413fb0eae813%3A0x96d129952cee20ad!2sYazevi%20Bozcaada!5e0!3m2!1sen!2str!4v1754561882895!5m2!1sen!2str"
          width="100%"
          height="480"
          style="border: 0;"
          allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.contact-editorial {
  scroll-snap-type: none;
  section {
    scroll-snap-align: none;
  }
}
.contact-form input,
.contact-form textarea {
  border-radius: 0;
}
.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-bottom-color: #1F1614 !important;
}
</style>
