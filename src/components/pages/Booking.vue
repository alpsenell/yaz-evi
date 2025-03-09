<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { db } from "../../firebase/config.ts";
import { collection, query, where, getDocs, addDoc, doc } from "firebase/firestore";
import i18next from "i18next";

import { ROOMS } from "../../enums/global.ts";

import DatePicker from "../organisms/DatePicker.vue";
import RoomGuestSelector from "../organisms/RoomGuestSelector.vue";
import BookingCard from "../organisms/BookingCard.vue";
import YazButton from "../atoms/YazButton.vue";

const selectedLanguage = ref(i18next.language<string>);
const roomNumber = ref(1);
const guestNumber = ref(2);
const loadingState = ref(false);
const selectedDates = ref({
  start: new Date(new Date().setDate(new Date().getDate() + 1)),
  end: new Date(new Date().setDate(new Date().getDate() + 2)),
});
const selectedRoom = ref({});
const availableRooms = ref([]);
const isBooking = ref(false);

const updateRooms = (value: number) => {
  roomNumber.value = value;
};
const updateGuests = (value: number) => {
  guestNumber.value = value;
};

const calculateNights = (start: Date | null, end: Date | null): number => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  const nights = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};

const formatDate = (date: Date | null) => {
  if (!date) {
    return '';
  }
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat(selectedLanguage.value === 'en' ?'en-US' : 'tr-TR', options).format(date);
};

const nights = computed(() => calculateNights(selectedDates.value.start, selectedDates.value.end));

const totalPrice = computed(() => {
  if (!selectedRoom.value.id) {
    return 0;
  }
  const total = selectedRoom.value.bookingInformation.price * nights.value;

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(total)
});

const formattedDates = computed(() => {
  if (!selectedDates.value.start || !selectedDates.value.end) {
    return '';
  }
  return `${formatDate(selectedDates.value.start)} -> ${formatDate(selectedDates.value.end)}`;
});

const updateDates = (dates: { start: Date | null; end: Date | null }) => {
  selectedDates.value = dates;
};

const checkRooms = async () => {
  availableRooms.value = await getAvailableRooms(selectedDates.value.start, selectedDates.value.end);
};

const isRoomAvailable = async (roomId: string, checkIn: string, checkOut: string) => {
  const roomRef = doc(db, "rooms", roomId);
  const bookingsRef = collection(roomRef, "bookings");

  const q = query(bookingsRef, where("checkInDate", "<", checkOut), where("checkOutDate", ">", checkIn));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty;
};

const bookRoom = async (room: object) => {
  isBooking.value = true;
  const { id } = room;
  const checkIn = selectedDates.value.start;
  const checkOut = selectedDates.value.end;

  if (await isRoomAvailable(id, checkIn, checkOut)) {
    const roomRef = doc(db, "rooms", id);
    const bookingsRef = collection(roomRef, "bookings");

    await addDoc(bookingsRef, {
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });

    isBooking.value = false;
  } else {
    isBooking.value = false;
  }
};

const getAvailableRooms = async (checkIn: string, checkOut: string) => {
  loadingState.value = true;
  const roomsRef = collection(db, "rooms");
  const roomsSnapshot = await getDocs(roomsRef);

  let availableRooms = [];

  for (const roomDoc of roomsSnapshot.docs) {
    const roomId = roomDoc.id;
    if (await isRoomAvailable(roomId, checkIn, checkOut)) {
      availableRooms.push(roomId);
    }
  }

  loadingState.value = false;
  return availableRooms;
};

watch(() => selectedDates, () => {
  checkRooms();
}, { deep: true, immediate: true });

</script>

<template>
  <section class="booking">
    <img
      class="max-h-72 w-full object-cover object-left"
      src="../../assets/media/home-gallery/gallery_left_1.jpg"
      alt="Banner image"
    >

    <div class="max-w-screen-xl mx-auto relative bottom-8 px-4">
      <div class="border-solid border-primary p-4 border-2 rounded-xl flex gap-4 bg-white flex-col md:flex-row">
        <DatePicker
          class="w-full md:w-fit"
          label="Select Dates"
          :selected-dates="selectedDates"
          :formatted-dates="formattedDates"
          @change="updateDates"
        />
        <RoomGuestSelector
          :guests="guestNumber"
          :rooms="roomNumber"
          @update-rooms="updateRooms"
          @update-guests="updateGuests"
        />
      </div>

      <div class="flex flex-col md:grid md:grid-cols-[744px_1fr] mt-8 gap-4">
        <div class="flex flex-col gap-8">
          <BookingCard
            v-for="(room) in ROOMS"
            :title="$t(room.title)"
            :images="room.images"
            :night-number="nights"
            :guest-number="guestNumber"
            :room="room"
            :selected-dates="selectedDates"
            :available="availableRooms.includes(room.id)"
            :loading="loadingState"
            :selected-room-id="selectedRoom.id"
            @selectRoom="selectedRoom = room"
          />
        </div>

        <div class="flex justify-between md:hidden fixed bottom-0 left-0 p-4 bg-white border-t border-solid border-primary w-full z-10">
          <div class="flex flex-col">
            <p class="font-montserrat text-md">
              {{ formattedDates }}
            </p>
            <p class="font-montserrat text-sm">
              {{ nights }} nights
            </p>
          </div>
          <YazButton
            :label="$t('bookNow')"
            type="primary"
          />
        </div>

        <div class="hidden md:flex flex-col gap-2 py-6 px-3 shadow-2xl rounded-2xl h-fit sticky top-16">
          <div class="flex justify-between items-center">
            <p class="font-montserrat text-md">
              {{ formattedDates }}
            </p>
          </div>

          <p class="font-montserrat text-sm">
            {{ nights }} {{ $t('nights') }}
          </p>

          <div class="flex gap-2">
            <p class="font-montserrat text-sm">
              {{ roomNumber }} {{ $t('room') }},
            </p>
            <p class="font-montserrat text-sm">
              {{ guestNumber }} {{ $t('guests') }}
            </p>
          </div>

          <span class="h-[0.5px] bg-primary my-2"></span>

          <div
            v-if="selectedRoom.id"
            class="w-full flex flex-col gap-2"
          >
            <div class="flex flex-col gap-1">
              <p class="font-raleway font-bold">{{ $t(selectedRoom.title) }}</p>
              <p class="font-montserrat text-xs text-primary">
                {{ nights }} {{ $t('nights') }}
              </p>
            </div>
            <span class="h-[0.5px] bg-primary my-2"></span>
            <div class="w-full flex justify-between items-center">
              <p class="font-raleway font-bold">
                {{ $t('totalPrice') }}:
              </p>
              <p class="font-raleway font-bold">
                {{ totalPrice }}
              </p>
            </div>
          </div>

          <YazButton
            :disabled="!selectedRoom.id"
            :label="$t('bookNow')"
            type="outlined"
            @click="bookRoom(selectedRoom)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
