<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { db } from "../../firebase/config.ts";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import i18next from "i18next";
import { DatePicker as VCalendarDatePicker } from "v-calendar";

import { ROOMS } from "../../enums/global.ts";
import { useBookings } from "../../composables/useBookings.ts";
import { useRoomPrices } from "../../composables/useRoomPrices.ts";
import type { Room } from "../../types/booking.ts";

import YazButton from "../atoms/YazButton.vue";
import YazIcon from "../atoms/YazIcon.vue";
import Loader from "../atoms/Loader.vue";
import { getMediaUrl } from '../../utils/media';

const router = useRouter();
const { fetchAllBookings, getDisabledDates, getCalendarAttributes } = useBookings();
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
  initialLoading.value = false;
});

const calculateNights = (start: Date | null, end: Date | null): number => {
  if (!start || !end) return 0;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const n = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return n > 0 ? n : 0;
};

const formatDate = (date: Date | null) => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat(selectedLanguage.value === 'en' ? 'en-US' : 'tr-TR', options).format(date);
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

const formattedPricePerNight = computed(() => {
  if (roomPrice.value === 0) return '';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(roomPrice.value);
});

const disabledDates = computed(() => {
  if (!selectedRoom.value) return [];
  return getDisabledDates(selectedRoom.value.id);
});

const calendarAttributes = computed(() => {
  if (!selectedRoom.value) return [];
  return getCalendarAttributes(selectedRoom.value.id);
});

const today = new Date();
today.setHours(0, 0, 0, 0);

const calendarColumns = computed(() => (window.innerWidth < 768 ? 1 : 2));
const calendarKey = ref(0);

const selectRoom = (room: Room) => {
  if (selectedRoom.value?.id === room.id) return;
  selectedRoom.value = room;
  selectedDates.value = { start: null, end: null };
  calendarKey.value++;
};

const changeRoom = () => {
  selectedRoom.value = null;
  selectedDates.value = { start: null, end: null };
  calendarKey.value++;
};

const handleDateChange = (dates: { start: Date | null; end: Date | null }) => {
  if (dates && dates.start && dates.end) {
    selectedDates.value = dates;
  }
};

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
  <section class="booking min-h-screen">
    <!-- Hero banner -->
    <div class="relative h-48 md:h-64 overflow-hidden">
      <img
        class="w-full h-full object-cover object-center"
        :src="getMediaUrl('home-gallery/gallery_left_1.jpg')"
        alt="Yaz Evi Bozcaada rezervasyon"
      >
      <div class="absolute inset-0 bg-secondaryDark/40 flex items-center justify-center">
        <h1 class="text-3xl md:text-4xl font-raleway font-light text-white tracking-wide">
          {{ $t('bookNow') }}
        </h1>
      </div>
    </div>

    <!-- Steps indicator -->
    <div class="max-w-screen-xl mx-auto px-4 py-6">
      <div class="flex items-center justify-center gap-2 md:gap-4 mb-8">
        <div
          v-for="(step, index) in [
            { num: 1, label: $t('booking.stepRoom') },
            { num: 2, label: $t('booking.stepDates') },
            { num: 3, label: $t('booking.stepSummary') },
          ]"
          :key="step.num"
          class="flex items-center gap-2 md:gap-4"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-montserrat transition-colors"
              :class="currentStep >= step.num
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500'"
            >
              {{ step.num }}
            </div>
            <span
              class="hidden md:block font-raleway text-sm transition-colors"
              :class="currentStep >= step.num ? 'text-primary' : 'text-gray-400'"
            >
              {{ step.label }}
            </span>
          </div>
          <div
            v-if="index < 2"
            class="w-8 md:w-16 h-[1px] transition-colors"
            :class="currentStep > step.num ? 'bg-primary' : 'bg-gray-200'"
          ></div>
        </div>
      </div>

      <!-- Instagram contact note -->
      <p class="text-center font-raleway text-sm text-primary mb-6">
        {{ $t('instagramContactNote') }}
        <a
          href="https://www.instagram.com/yazevibozcaada_/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-secondaryDark"
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
        <!-- STEP 1: Room Selection -->
        <div v-if="currentStep === 1">
          <p class="font-raleway text-lg text-primary mb-6 text-center">
            {{ $t('booking.chooseRoom') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="room in ROOMS"
              :key="room.id"
              class="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              :class="selectedRoom?.id === room.id ? 'ring-2 ring-primary' : ''"
              @click="selectRoom(room)"
            >
              <!-- Room image -->
              <div class="relative h-56 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  :src="getMediaUrl(room.image)"
                  :alt="$t(room.title)"
                  loading="lazy"
                >
                <div
                  v-if="formattedPricePerNight && getPrice(room.id)"
                  class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1"
                >
                  <p class="font-montserrat text-sm font-bold text-secondaryDark">
                    {{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(getPrice(room.id)!) }}
                  </p>
                  <p class="font-raleway text-[10px] text-primary text-right">/ {{ $t('booking.perNight') }}</p>
                </div>
              </div>

              <!-- Room info -->
              <div class="p-4 bg-white">
                <h3 class="font-raleway text-lg font-medium text-secondaryDark mb-2">
                  {{ $t(room.title) }}
                </h3>

                <div class="flex flex-wrap gap-3 text-sm text-primary mb-3">
                  <div class="flex items-center gap-1">
                    <YazIcon name="person" :size="18" />
                    <span class="font-raleway">{{ room.bookingInformation.guestNumber }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <YazIcon name="bed" :size="18" />
                    <span class="font-raleway">
                      {{ room.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="font-raleway">{{ room.bookingInformation.size }}m²</span>
                  </div>
                </div>

                <p class="font-raleway text-xs text-primary line-clamp-2">
                  {{ $t(room.description) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Date Selection (room is chosen) -->
        <div v-if="currentStep === 2">
          <!-- Selected room summary bar -->
          <div class="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
            <img
              class="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
              :src="getMediaUrl(selectedRoom!.image)"
              :alt="$t(selectedRoom!.title)"
            >
            <div class="flex-1">
              <h3 class="font-raleway font-medium text-lg text-secondaryDark">
                {{ $t(selectedRoom!.title) }}
              </h3>
              <p class="font-raleway text-sm text-primary">
                {{ selectedRoom!.bookingInformation.size }}m² · {{ selectedRoom!.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}
              </p>
            </div>
            <button
              @click="changeRoom"
              class="font-raleway text-sm text-primary underline hover:text-secondaryDark transition-colors"
            >
              {{ $t('booking.changeRoom') }}
            </button>
          </div>

          <p class="font-raleway text-lg text-primary mb-4 text-center">
            {{ $t('booking.chooseDates') }}
          </p>

          <!-- Legend -->
          <div class="flex items-center justify-center gap-6 mb-4">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span class="font-raleway text-xs text-primary">{{ $t('calendar.dateBooked') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span class="font-raleway text-xs text-primary">{{ $t('booking.yourSelection') }}</span>
            </div>
          </div>

          <!-- Inline calendar -->
          <div class="flex justify-center">
            <div class="bg-white rounded-2xl shadow-lg p-4 md:p-6 w-fit">
              <VCalendarDatePicker
                :key="calendarKey"
                :columns="calendarColumns"
                :min-date="today"
                :disabled-dates="disabledDates"
                :attributes="calendarAttributes"
                is-range
                :first-day-of-week="2"
                @update:model-value="handleDateChange"
              />

              <!-- Guest count under calendar -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span class="font-raleway text-sm text-primary">{{ $t('guests') }}</span>
                <div class="flex items-center gap-3">
                  <button
                    @click="guestNumber = Math.max(1, guestNumber - 1)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span class="font-montserrat text-sm w-4 text-center">{{ guestNumber }}</span>
                  <button
                    @click="guestNumber = Math.min(selectedRoom!.bookingInformation.guestNumber, guestNumber + 1)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Summary (room + dates chosen) -->
        <div v-if="currentStep === 3" class="pb-20 md:pb-0">
          <div class="max-w-xl mx-auto">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <!-- Room image -->
              <div class="relative h-48 md:h-64">
                <img
                  class="w-full h-full object-cover"
                  :src="getMediaUrl(selectedRoom!.image)"
                  :alt="$t(selectedRoom!.title)"
                >
              </div>

              <div class="p-6 flex flex-col gap-4">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-raleway font-medium text-xl text-secondaryDark">
                      {{ $t(selectedRoom!.title) }}
                    </h3>
                    <p class="font-raleway text-sm text-primary mt-1">
                      {{ selectedRoom!.bookingInformation.size }}m² · {{ selectedRoom!.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}
                    </p>
                  </div>
                  <button
                    @click="changeRoom"
                    class="font-raleway text-sm text-primary underline hover:text-secondaryDark transition-colors shrink-0"
                  >
                    {{ $t('booking.changeRoom') }}
                  </button>
                </div>

                <span class="h-[0.5px] bg-gray-200"></span>

                <!-- Dates -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="font-raleway text-xs text-primary">{{ $t('checkout.checkIn') }}</p>
                    <p class="font-montserrat text-sm text-secondaryDark mt-1">{{ formatDate(selectedDates.start) }}</p>
                  </div>
                  <div>
                    <p class="font-raleway text-xs text-primary">{{ $t('checkout.checkOut') }}</p>
                    <p class="font-montserrat text-sm text-secondaryDark mt-1">{{ formatDate(selectedDates.end) }}</p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div>
                    <p class="font-raleway text-xs text-primary">{{ $t('nights') }}</p>
                    <p class="font-montserrat text-sm text-secondaryDark mt-1">{{ nights }}</p>
                  </div>
                  <div>
                    <p class="font-raleway text-xs text-primary">{{ $t('guests') }}</p>
                    <p class="font-montserrat text-sm text-secondaryDark mt-1">{{ guestNumber }}</p>
                  </div>
                </div>

                <button
                  @click="selectedDates = { start: null, end: null }"
                  class="font-raleway text-sm text-primary underline hover:text-secondaryDark transition-colors w-fit"
                >
                  {{ $t('booking.changeDates') }}
                </button>

                <span class="h-[0.5px] bg-gray-200"></span>

                <!-- Price -->
                <div class="flex flex-col gap-2">
                  <div
                    v-if="formattedPricePerNight"
                    class="flex justify-between"
                  >
                    <p class="font-raleway text-sm text-primary">
                      {{ formattedPricePerNight }} x {{ nights }} {{ $t('nights') }}
                    </p>
                    <p class="font-montserrat text-sm text-secondaryDark">{{ totalPrice }}</p>
                  </div>

                  <div
                    v-if="totalPrice"
                    class="flex justify-between pt-2 border-t border-gray-100"
                  >
                    <p class="font-raleway font-bold text-base text-secondaryDark">{{ $t('totalPrice') }}</p>
                    <p class="font-montserrat font-bold text-base text-secondaryDark">{{ totalPrice }}</p>
                  </div>
                </div>

                <YazButton
                  :label="$t('bookNow')"
                  type="primary"
                  class="w-full mt-2 hidden md:flex"
                  @click="goToCheckout"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Mobile sticky footer for step 3 -->
    <div
      v-if="currentStep === 3 && selectedRoom"
      class="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-10 flex items-center justify-between"
    >
      <div>
        <p class="font-montserrat text-sm font-bold text-secondaryDark">{{ totalPrice }}</p>
        <p class="font-raleway text-xs text-primary">{{ nights }} {{ $t('nights') }}</p>
      </div>
      <YazButton
        :label="$t('bookNow')"
        type="primary"
        @click="goToCheckout"
      />
    </div>
  </section>
</template>
