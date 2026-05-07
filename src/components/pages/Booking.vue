<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { db } from "../../firebase/config.ts";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
import i18next from "i18next";
import { DatePicker as VCalendarDatePicker } from "v-calendar";

import { ROOMS } from "../../enums/global.ts";
import { ROOMS_V1 } from "../../data/rooms";
import { useBookings } from "../../composables/useBookings.ts";
import { useRoomPrices } from "../../composables/useRoomPrices.ts";
import type { Room } from "../../types/booking.ts";

import YazButton from "../atoms/YazButton.vue";
import YazIcon from "../atoms/YazIcon.vue";
import Loader from "../atoms/Loader.vue";
import HotelImage from "../atoms/HotelImage.vue";
import Eyebrow from "../atoms/Eyebrow.vue";
import { getMediaUrl } from '../../utils/media';

const editorialFor = (id: string | number) => ROOMS_V1.find(r => r.id === Number(id));
const editorialLang = computed<'tr' | 'en'>(() => (i18next.language?.startsWith('tr') ? 'tr' : 'en'));

const route = useRoute();
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

  const roomSlug = route.query.room as string | undefined;
  if (roomSlug) {
    const preselected = ROOMS.find(r => r.slug === roomSlug);
    if (preselected) {
      selectedRoom.value = preselected;
    }
  }

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
  <section class="booking min-h-screen bg-cream text-ink">
    <!-- Editorial hero -->
    <div class="px-6 md:px-16 pt-12 md:pt-20 pb-10 md:pb-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-end">
        <h1
          class="md:col-span-7 font-display font-light leading-[0.95] m-0"
          style="font-size: clamp(48px, 7vw, 96px); letter-spacing: -0.02em;"
        >
          <span class="italic text-peach">{{ $t('bookNow') }}</span>
        </h1>
        <p class="md:col-span-5 text-[15px] md:text-[16px] leading-[1.7] opacity-80 m-0 font-raleway font-light">
          {{ $t('booking.heroLede') }}
        </p>
      </div>
    </div>

    <!-- Editorial steps indicator -->
    <div class="px-6 md:px-16">
      <div class="grid grid-cols-3 gap-4 md:gap-8 border-t border-ink/20 py-6 md:py-8">
        <div
          v-for="(step) in [
            { num: 1, label: $t('booking.stepRoom') },
            { num: 2, label: $t('booking.stepDates') },
            { num: 3, label: $t('booking.stepSummary') },
          ]"
          :key="step.num"
          class="flex items-baseline gap-3"
          :class="currentStep === step.num ? 'opacity-100' : (currentStep > step.num ? 'opacity-60' : 'opacity-35')"
        >
          <span class="font-mono text-[11px] tracking-nav">0{{ step.num }}</span>
          <span class="text-[11px] md:text-[12px] tracking-widest3 uppercase font-raleway"
            :class="currentStep === step.num ? 'font-semibold' : 'font-medium'">
            {{ step.label }}
          </span>
          <span v-if="currentStep > step.num" class="text-peach text-[14px]">✓</span>
          <span class="flex-1 h-px ml-2"
            :class="currentStep === step.num ? 'bg-ink' : (currentStep > step.num ? 'bg-peach' : 'bg-ink/20')"></span>
        </div>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto px-4 py-6">

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
        <div v-if="currentStep === 1" class="px-2 md:px-16">
          <p class="font-raleway text-[15px] md:text-[16px] opacity-80 mb-10 md:mb-12">
            {{ $t('booking.chooseRoom') }}
          </p>

          <div class="flex flex-col gap-4">
            <div
              v-for="(room, idx) in ROOMS"
              :key="room.id"
              tabindex="0"
              role="button"
              :aria-label="$t(room.title)"
              class="booking-room-card cursor-pointer border rounded-[4px] p-4 md:p-6 grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 md:gap-8 items-center transition-colors focus-visible:outline-none"
              :class="selectedRoom?.id === room.id ? 'border-ink bg-peach/[0.08]' : 'border-ink/15 hover:border-ink/40'"
              @click="selectRoom(room)"
              @keydown.enter="selectRoom(room)"
              @keydown.space.prevent="selectRoom(room)"
            >
              <HotelImage
                :src="editorialFor(room.id)?.photos?.[0] || room.image"
                :alt="$t(room.title)"
                class="h-[180px] md:h-[140px]"
              />

              <div>
                <div class="text-[10px] tracking-widest3 uppercase opacity-50 font-mono mb-1">0{{ idx + 1 }} / 05</div>
                <h3 class="font-display font-light text-[28px] md:text-[36px] leading-none mb-2 m-0">
                  {{ editorialFor(room.id) ? (editorialLang === 'tr' ? editorialFor(room.id)!.nameTr : editorialFor(room.id)!.nameEn) : $t(room.title) }}
                </h3>
                <div v-if="editorialFor(room.id)" class="font-display italic text-muted text-[14px] md:text-[16px] mb-3">
                  {{ editorialLang === 'tr' ? editorialFor(room.id)!.subTr : editorialFor(room.id)!.subEn }}
                </div>
                <div class="text-[11px] tracking-nav uppercase opacity-60 flex flex-wrap gap-x-4 gap-y-1">
                  <span>{{ room.bookingInformation.guestNumber }} {{ editorialLang === 'tr' ? 'kişi' : 'guests' }}</span>
                  <span class="opacity-40">·</span>
                  <span>{{ room.bookingInformation.size }} m²</span>
                  <span v-if="editorialFor(room.id)" class="opacity-40">·</span>
                  <span v-if="editorialFor(room.id)">{{ editorialFor(room.id)!.view[editorialLang] }}</span>
                </div>
              </div>

              <div class="text-left md:text-right">
                <div v-if="getPrice(room.id)" class="text-[10px] tracking-widest3 uppercase opacity-55 mb-1">
                  {{ editorialLang === 'tr' ? 'Gecelik' : 'From' }}
                </div>
                <div v-if="getPrice(room.id)" class="font-display italic text-[24px] md:text-[28px] mb-4">
                  {{ new Intl.NumberFormat(editorialLang === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: 'TRY' }).format(getPrice(room.id)!) }}
                </div>
                <div
                  class="inline-block px-5 py-2.5 rounded-full text-[11px] tracking-nav uppercase font-semibold border transition-colors"
                  :class="selectedRoom?.id === room.id ? 'bg-ink text-cream border-ink' : 'border-ink text-ink'"
                >
                  {{ selectedRoom?.id === room.id
                    ? (editorialLang === 'tr' ? 'Seçildi ✓' : 'Selected ✓')
                    : (editorialLang === 'tr' ? 'Seç' : 'Select') }} →
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Date Selection (room is chosen) -->
        <div v-if="currentStep === 2" class="px-2 md:px-16">
          <!-- Selected room summary bar -->
          <div class="grid grid-cols-[80px_1fr_auto] gap-4 md:gap-6 items-center mb-10 py-4 border-y border-ink/15">
            <HotelImage
              :src="editorialFor(selectedRoom!.id)?.photos?.[0] || selectedRoom!.image"
              :alt="$t(selectedRoom!.title)"
              class="h-[80px]"
            />
            <div>
              <div class="text-[10px] tracking-widest3 uppercase opacity-55 mb-1">
                {{ editorialLang === 'tr' ? 'Seçilen oda' : 'Selected room' }}
              </div>
              <h3 class="font-display italic text-[22px] md:text-[26px] leading-none m-0">
                {{ editorialFor(selectedRoom!.id) ? (editorialLang === 'tr' ? editorialFor(selectedRoom!.id)!.nameTr : editorialFor(selectedRoom!.id)!.nameEn) : $t(selectedRoom!.title) }}
              </h3>
              <p class="text-[11px] tracking-nav uppercase opacity-60 mt-2 m-0">
                {{ selectedRoom!.bookingInformation.size }}m² · {{ selectedRoom!.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}
              </p>
            </div>
            <button
              type="button"
              @click="changeRoom"
              class="text-[11px] tracking-nav uppercase font-medium border-b border-ink pb-1 bg-transparent border-x-0 border-t-0 cursor-pointer text-ink"
            >
              {{ $t('booking.changeRoom') }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-end mb-8">
            <h2 class="md:col-span-7 font-display font-light m-0" style="font-size: clamp(36px, 5vw, 64px); line-height: 0.95; letter-spacing: -0.02em;">
              <span class="italic text-peach">{{ $t('booking.chooseDates') }}</span>
            </h2>
            <div class="md:col-span-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] tracking-nav uppercase opacity-70">
              <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full" style="background: rgba(250,170,141,0.3); border: 1px solid #FAAA8D;"></span>
                <span>{{ $t('booking.yourSelection') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-ink/20 border border-ink/40"></span>
                <span>{{ $t('calendar.dateBooked') }}</span>
              </div>
            </div>
          </div>

          <!-- Editorial calendar wrapper -->
          <div class="booking-calendar bg-cream rounded-[4px] py-4 md:py-6 px-2 md:px-4 border border-ink/15">
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
            <div class="flex items-center justify-between mt-6 pt-6 border-t border-ink/15 px-2 md:px-4">
              <span class="text-[11px] tracking-widest3 uppercase opacity-55 font-semibold">{{ $t('guests') }}</span>
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  @click="guestNumber = Math.max(1, guestNumber - 1)"
                  class="w-9 h-9 rounded-full border border-ink/40 flex items-center justify-center hover:border-ink transition-colors bg-transparent cursor-pointer text-ink text-[16px] leading-none"
                >−</button>
                <span class="font-display italic text-[24px] w-6 text-center">{{ guestNumber }}</span>
                <button
                  type="button"
                  @click="guestNumber = Math.min(selectedRoom!.bookingInformation.guestNumber, guestNumber + 1)"
                  class="w-9 h-9 rounded-full border border-ink/40 flex items-center justify-center hover:border-ink transition-colors bg-transparent cursor-pointer text-ink text-[16px] leading-none"
                >+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Summary (room + dates chosen) -->
        <div v-if="currentStep === 3" class="pb-24 md:pb-12 px-2 md:px-16">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <!-- Left: Recap -->
            <div class="md:col-span-7">
              <Eyebrow class="mb-6">{{ editorialLang === 'tr' ? 'Özet' : 'Summary' }}</Eyebrow>
              <h2 class="font-display font-light m-0" style="font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.02em;">
                <span class="italic">{{ editorialFor(selectedRoom!.id) ? (editorialLang === 'tr' ? editorialFor(selectedRoom!.id)!.nameTr : editorialFor(selectedRoom!.id)!.nameEn) : $t(selectedRoom!.title) }}</span>
              </h2>
              <p v-if="editorialFor(selectedRoom!.id)" class="font-display italic text-muted text-[20px] md:text-[24px] mt-4 mb-10">
                {{ editorialLang === 'tr' ? editorialFor(selectedRoom!.id)!.subTr : editorialFor(selectedRoom!.id)!.subEn }}
              </p>

              <div class="border-t border-ink/15 py-5 flex justify-between items-baseline gap-6">
                <span class="text-[11px] tracking-widest3 uppercase opacity-55">{{ $t('checkout.checkIn') }}</span>
                <span class="font-display italic text-[20px] md:text-[24px]">{{ formatDate(selectedDates.start) }}</span>
              </div>
              <div class="border-t border-ink/15 py-5 flex justify-between items-baseline gap-6">
                <span class="text-[11px] tracking-widest3 uppercase opacity-55">{{ $t('checkout.checkOut') }}</span>
                <span class="font-display italic text-[20px] md:text-[24px]">{{ formatDate(selectedDates.end) }}</span>
              </div>
              <div class="border-t border-ink/15 py-5 flex justify-between items-baseline gap-6">
                <span class="text-[11px] tracking-widest3 uppercase opacity-55">{{ $t('nights') }}</span>
                <span class="font-display italic text-[20px] md:text-[24px]">{{ nights }}</span>
              </div>
              <div class="border-t border-ink/15 py-5 flex justify-between items-baseline gap-6">
                <span class="text-[11px] tracking-widest3 uppercase opacity-55">{{ $t('guests') }}</span>
                <span class="font-display italic text-[20px] md:text-[24px]">{{ guestNumber }}</span>
              </div>

              <div class="flex flex-wrap gap-x-8 gap-y-2 mt-8">
                <button
                  type="button"
                  @click="changeRoom"
                  class="text-[11px] tracking-nav uppercase font-medium border-b border-ink pb-1 bg-transparent border-x-0 border-t-0 cursor-pointer text-ink"
                >{{ $t('booking.changeRoom') }}</button>
                <button
                  type="button"
                  @click="selectedDates = { start: null, end: null }"
                  class="text-[11px] tracking-nav uppercase font-medium border-b border-ink pb-1 bg-transparent border-x-0 border-t-0 cursor-pointer text-ink"
                >{{ $t('booking.changeDates') }}</button>
              </div>
            </div>

            <!-- Right: Dark booking card -->
            <div class="md:col-span-5">
              <div class="bg-ink text-cream rounded-[4px] p-8 md:p-10 md:sticky md:top-8">
                <div class="text-[11px] tracking-widest3 uppercase opacity-70 mb-4">
                  {{ formattedPricePerNight }} × {{ nights }} {{ $t('nights') }}
                </div>
                <HotelImage
                  :src="editorialFor(selectedRoom!.id)?.photos?.[0] || selectedRoom!.image"
                  :alt="$t(selectedRoom!.title)"
                  class="h-[180px] mb-8"
                />
                <div class="h-px bg-cream/15 mb-6"></div>
                <div class="flex justify-between items-baseline mb-8">
                  <span class="text-[11px] tracking-widest3 uppercase">{{ $t('totalPrice') }}</span>
                  <span class="font-display italic text-peach" style="font-size: clamp(36px, 4vw, 48px); letter-spacing: -0.02em;">{{ totalPrice }}</span>
                </div>
                <button
                  type="button"
                  @click="goToCheckout"
                  class="hidden md:block w-full px-8 py-5 bg-peach text-ink rounded-full text-[12px] tracking-nav uppercase font-semibold border-none cursor-pointer"
                >
                  {{ $t('bookNow') }} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Mobile sticky footer for step 3 -->
    <div
      v-if="currentStep === 3 && selectedRoom"
      class="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-ink text-cream border-t border-ink z-10 flex items-center justify-between gap-4"
    >
      <div>
        <p class="font-display italic text-peach text-[22px] m-0 leading-none">{{ totalPrice }}</p>
        <p class="text-[11px] tracking-nav uppercase opacity-70 mt-1 m-0">{{ nights }} {{ $t('nights') }}</p>
      </div>
      <button
        type="button"
        @click="goToCheckout"
        class="px-6 py-3 bg-peach text-ink rounded-full text-[11px] tracking-nav uppercase font-semibold border-none cursor-pointer"
      >
        {{ $t('bookNow') }} →
      </button>
    </div>
  </section>
</template>

<style lang="scss">
/* v-calendar editorial overrides */
.booking-calendar {
  .vc-container {
    --vc-bg: transparent;
    --vc-border: transparent;
    background: transparent;
    border: none;
    font-family: 'Raleway', sans-serif;
    color: #1F1614;
  }
  .vc-header {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .vc-title {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: 22px;
    color: #1F1614;
    background: none;
  }
  .vc-arrow {
    background: none;
    color: #1F1614;
    border-radius: 9999px;
    &:hover { background: rgba(31, 22, 20, 0.08); }
  }
  .vc-weekday {
    font-family: 'Raleway', sans-serif;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(31, 22, 20, 0.5);
    font-weight: 600;
    padding-bottom: 8px;
  }
  .vc-day-content {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 16px;
    font-weight: 400;
    color: #1F1614;
    border-radius: 9999px;
    transition: background-color 0.15s ease, color 0.15s ease;
    &:hover {
      background: rgba(250, 170, 141, 0.25);
      color: #1F1614;
    }
    &:focus {
      background: rgba(250, 170, 141, 0.4);
    }
  }
  .vc-highlight {
    background: rgba(250, 170, 141, 0.25);
    border: none;
    &.vc-highlight-base-start,
    &.vc-highlight-base-end {
      background: #1F1614;
    }
  }
  .vc-highlight-bg-solid + .vc-day-content,
  .vc-highlights .vc-day-content {
    color: #1F1614;
  }
  .vc-day.is-disabled .vc-day-content {
    color: rgba(31, 22, 20, 0.25);
    text-decoration: line-through;
  }
  .vc-dot {
    background: #FAAA8D;
  }
  .vc-popover-content {
    background: #F5EFE4;
    border: 1px solid rgba(31, 22, 20, 0.15);
  }
}
</style>
