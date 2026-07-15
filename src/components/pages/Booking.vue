<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import i18next from "i18next";

import { ROOMS } from "../../enums/global.ts";
import { useBookings } from "../../composables/useBookings.ts";
import { useRoomPrices } from "../../composables/useRoomPrices.ts";
import type { Room } from "../../types/booking.ts";

import Loader from "../atoms/Loader.vue";
import BookingCalendar from "../organisms/BookingCalendar.vue";
import { getMediaUrl } from '../../utils/media';

const route = useRoute();
const router = useRouter();
const { fetchAllBookings, getDisabledDates } = useBookings();
const { fetchPrices, getPrice } = useRoomPrices();

const selectedLanguage = ref(i18next.language as string);
const guestNumber = ref(2);
const initialLoading = ref(true);
const selectedDates = ref<{ start: Date | null; end: Date | null }>({
  start: null,
  end: null,
});
const selectedRoom = ref<Room | null>(null);

// Step tracking: 1 = pick room, 2 = pick dates, 3 = summary
const currentStep = computed(() => {
  if (!selectedRoom.value) return 1;
  if (!selectedDates.value.start || !selectedDates.value.end) return 2;
  return 3;
});

onMounted(async () => {
  await Promise.all([fetchAllBookings(), fetchPrices()]);

  const roomSlug = route.query.room as string | undefined;
  if (roomSlug) {
    const preselected = ROOMS.find(r => r.slug === roomSlug);
    if (preselected) {
      selectedRoom.value = preselected;
    }
  }

  const guestsParam = Number(route.query.guests);
  if (!Number.isNaN(guestsParam) && guestsParam >= 1) {
    guestNumber.value = Math.min(guestsParam, 6);
  }

  initialLoading.value = false;
});

const onLanguageChanged = (lang: string) => {
  selectedLanguage.value = lang;
};
i18next.on('languageChanged', onLanguageChanged);
onBeforeUnmount(() => i18next.off('languageChanged', onLanguageChanged));

const calculateNights = (start: Date | null, end: Date | null): number => {
  if (!start || !end) return 0;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const n = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return n > 0 ? n : 0;
};

const formatDate = (date: Date | null) => {
  if (!date) return '—';
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat(selectedLanguage.value?.startsWith('en') ? 'en-US' : 'tr-TR', options).format(date);
};

const nights = computed(() => calculateNights(selectedDates.value.start, selectedDates.value.end));

const roomPrice = computed(() => {
  if (!selectedRoom.value) return 0;
  return getPrice(selectedRoom.value.id) ?? 0;
});

const totalPrice = computed(() => {
  if (!selectedRoom.value || roomPrice.value === 0 || nights.value === 0) return '';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(roomPrice.value * nights.value);
});

const bookedRanges = computed(() => {
  if (!selectedRoom.value) return [];
  return getDisabledDates(selectedRoom.value.id);
});

const selectRoom = (room: Room) => {
  if (selectedRoom.value?.id === room.id) return;
  selectedRoom.value = room;
  selectedDates.value = { start: null, end: null };
};

const maxGuests = computed(() => selectedRoom.value?.bookingInformation.guestNumber ?? 6);

const goToCheckout = () => {
  if (!selectedRoom.value || !selectedDates.value.start || !selectedDates.value.end) return;

  const state = {
    roomId: selectedRoom.value.id,
    checkIn: selectedDates.value.start.toISOString(),
    checkOut: selectedDates.value.end.toISOString(),
    nights: nights.value,
    guests: guestNumber.value,
    rooms: 1,
    pricePerNight: roomPrice.value,
    totalPrice: roomPrice.value * nights.value,
    locale: selectedLanguage.value,
  };

  sessionStorage.setItem('bookingState', JSON.stringify(state));
  router.push('/checkout');
};
</script>

<template>
  <main class="booking page-fade bg-cream min-h-screen">
    <!-- Hero -->
    <div class="relative h-[360px] md:h-[440px] overflow-hidden">
      <img
        class="absolute inset-0 w-full h-full object-cover"
        :src="getMediaUrl('home-gallery/gallery_left_1.jpg')"
        alt="Yaz Evi Bozcaada rezervasyon"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.45)] via-[rgba(16,32,40,0.25)] to-[rgba(16,32,40,0.55)]"></div>
      <div class="absolute left-0 right-0 top-[56%] -translate-y-1/2 text-center text-white px-6">
        <div class="eyebrow-light mb-5">{{ $t('v2.booking.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[44px] md:text-[58px] lg:text-[78px] m-0">{{ $t('v2.stay') }}</h1>
      </div>
    </div>

    <!-- Steps -->
    <div class="flex items-start justify-center gap-2 md:gap-5 max-w-[640px] mx-auto pt-14 md:pt-20 px-6 pb-5">
      <div
        v-for="step in [
          { num: 1, label: $t('booking.stepRoom') },
          { num: 2, label: $t('booking.stepDates') },
          { num: 3, label: $t('booking.stepSummary') },
        ]"
        :key="step.num"
        class="flex flex-col items-center gap-2.5 w-[130px]"
      >
        <div
          class="w-11 h-11 rounded-full flex items-center justify-center font-serif text-[19px] transition-colors"
          :class="currentStep > step.num
            ? 'bg-azure text-white'
            : currentStep === step.num
              ? 'bg-ink text-white'
              : 'border border-[#cfc4ac] text-[#b3ab99]'"
        >
          0{{ step.num }}
        </div>
        <div
          class="font-jost text-[11px] tracking-[0.2em] uppercase text-center transition-colors"
          :class="currentStep === step.num ? 'text-ink' : currentStep > step.num ? 'text-azure' : 'text-[#a49c88]'"
        >
          {{ step.label }}
        </div>
      </div>
    </div>

    <!-- Instagram contact note -->
    <p class="text-center font-jost font-light text-sm text-slate px-6 mb-2">
      {{ $t('instagramContactNote') }}
      <a
        href="https://www.instagram.com/yazevibozcaada_/"
        target="_blank"
        rel="noopener noreferrer"
        class="underline text-azure hover:text-ink"
      >
        Instagram
      </a>
    </p>

    <!-- Loading state -->
    <div
      v-if="initialLoading"
      class="flex items-center justify-center py-24"
    >
      <Loader />
    </div>

    <template v-else>
      <!-- Room strip -->
      <div class="px-6 md:px-14 pt-8 pb-2.5">
        <div class="eyebrow mb-5">{{ $t('v2.booking.yourRoom') }}</div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-5">
          <button
            v-for="room in ROOMS"
            :key="room.id"
            type="button"
            class="block text-left cursor-pointer bg-transparent border-none p-0"
            :class="selectedRoom?.id === room.id ? 'outline outline-2 outline-azure outline-offset-[3px]' : ''"
            @click="selectRoom(room)"
          >
            <div class="relative h-[130px] mb-2.5 overflow-hidden">
              <img
                class="absolute inset-0 w-full h-full object-cover"
                :src="getMediaUrl(room.image)"
                :alt="room.name"
                loading="lazy"
              >
              <div
                v-if="selectedRoom?.id === room.id"
                class="absolute top-2 right-2 bg-azure text-white font-jost text-[10px] tracking-[0.18em] uppercase px-2 py-1"
              >
                {{ $t('v2.booking.selected') }}
              </div>
            </div>
            <div class="flex justify-between items-baseline">
              <span class="font-serif text-xl text-ink capitalize">{{ room.name }}</span>
              <span class="font-jost text-[11px] text-stone">{{ room.bookingInformation.size }} m²</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Calendar + summary -->
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-11 md:gap-14 px-6 md:px-14 pt-10 md:pt-14 pb-[70px] md:pb-[100px] items-start">
        <div>
          <h2 class="font-serif font-light text-[32px] md:text-[44px] leading-[1.1] text-ink mt-0 mb-1.5">{{ $t('v2.booking.selectDates') }}</h2>
          <p class="font-jost font-light text-sm text-[#7a8386] mt-1.5 mb-6">{{ $t('v2.booking.bookedNote') }}</p>

          <div class="flex gap-6 mb-6">
            <div class="flex items-center gap-2">
              <span class="w-[15px] h-[15px] bg-sandFill inline-block"></span>
              <span class="font-jost text-xs text-slate">{{ $t('v2.booking.yourSelection') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-[15px] h-[15px] border border-[#c2b49a] inline-block"></span>
              <span class="font-jost text-xs text-slate">{{ $t('v2.booking.booked') }}</span>
            </div>
          </div>

          <BookingCalendar
            v-if="selectedRoom"
            v-model="selectedDates"
            :booked-ranges="bookedRanges"
            :locale="selectedLanguage"
          />
          <p v-else class="font-jost font-light text-base text-slate border border-sand p-6 max-w-[460px]">
            {{ $t('booking.chooseRoom') }}
          </p>

          <!-- Guests -->
          <div
            v-if="selectedRoom"
            class="flex items-center justify-between mt-8 pt-6 border-t border-sand max-w-[320px]"
          >
            <span class="font-jost text-[13px] tracking-[0.14em] uppercase text-slate">{{ $t('v2.guests') }}</span>
            <div class="flex items-center gap-4">
              <button
                type="button"
                class="w-[34px] h-[34px] border border-[#cfc4ac] rounded-full flex items-center justify-center text-ink cursor-pointer bg-transparent"
                @click="guestNumber = Math.max(1, guestNumber - 1)"
              >–</button>
              <span class="font-serif text-[22px] text-ink w-4 text-center">{{ guestNumber }}</span>
              <button
                type="button"
                class="w-[34px] h-[34px] border border-[#cfc4ac] rounded-full flex items-center justify-center text-ink cursor-pointer bg-transparent"
                @click="guestNumber = Math.min(maxGuests, guestNumber + 1)"
              >+</button>
            </div>
          </div>
        </div>

        <!-- Summary card -->
        <div class="bg-ink text-parchment">
          <div class="relative h-[200px]">
            <img
              v-if="selectedRoom"
              :src="getMediaUrl(selectedRoom.image)"
              :alt="selectedRoom.name"
              class="absolute inset-0 w-full h-full object-cover"
            >
            <div v-else class="absolute inset-0 bg-inkDeep"></div>
          </div>
          <div class="p-7 md:p-8">
            <div class="font-jost text-[11px] tracking-[0.3em] uppercase text-azureSoft mb-2.5">{{ $t('v2.booking.summaryEyebrow') }}</div>
            <h3 class="font-serif font-light text-[32px] mt-0 mb-1 capitalize">{{ selectedRoom?.name ?? '—' }}</h3>
            <p class="font-jost font-light text-[13px] text-[#a9bcc2] mt-0 mb-5">
              <template v-if="selectedRoom">
                {{ selectedRoom.bookingInformation.size }} m² · {{ selectedRoom.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}
              </template>
              <template v-else>&nbsp;</template>
            </p>
            <div class="grid grid-cols-2 gap-4 pb-5 border-b border-white/15">
              <div>
                <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('v2.checkIn') }}</div>
                <div class="font-serif text-xl">{{ formatDate(selectedDates.start) }}</div>
              </div>
              <div>
                <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('v2.checkOut') }}</div>
                <div class="font-serif text-xl">{{ formatDate(selectedDates.end) }}</div>
              </div>
              <div>
                <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('v2.nights') }}</div>
                <div class="font-serif text-xl">{{ nights || '—' }}</div>
              </div>
              <div>
                <div class="font-jost text-[11px] tracking-[0.18em] uppercase text-azureSoft mb-1.5">{{ $t('v2.guests') }}</div>
                <div class="font-serif text-xl">{{ guestNumber }}</div>
              </div>
            </div>
            <div class="flex items-center justify-between py-5">
              <span class="font-jost text-xs tracking-[0.2em] uppercase text-azureSoft">{{ $t('v2.booking.total') }}</span>
              <span v-if="totalPrice" class="font-serif text-[22px]">{{ totalPrice }}</span>
              <router-link
                v-else
                to="/contact"
                class="font-serif italic text-[22px] underline decoration-1 underline-offset-4 hover:text-azureSoft transition-colors"
              >{{ $t('v2.booking.onRequest') }}</router-link>
            </div>
            <button
              type="button"
              :disabled="currentStep !== 3"
              class="block w-full text-center font-jost text-xs tracking-[0.28em] uppercase bg-parchment text-ink p-4 cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
              @click="goToCheckout"
            >
              {{ $t('v2.book') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Mobile sticky footer for step 3 -->
    <div
      v-if="currentStep === 3 && selectedRoom"
      class="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-cream border-t border-sand shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-30 flex items-center justify-between"
    >
      <div>
        <p class="font-serif text-lg text-ink m-0 capitalize">{{ selectedRoom.name }}</p>
        <p class="font-jost font-light text-xs text-slate m-0">{{ nights }} {{ $t('v2.nights') }} · {{ guestNumber }} {{ $t('v2.guests') }}</p>
      </div>
      <button
        type="button"
        class="font-jost text-xs tracking-[0.28em] uppercase bg-ink text-parchment px-6 py-3.5 cursor-pointer border-none"
        @click="goToCheckout"
      >
        {{ $t('v2.book') }}
      </button>
    </div>
  </main>
</template>
