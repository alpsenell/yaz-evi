<template>
  <div
    class="relative"
    v-click-outside="closeSelection"
  >
    <button
      @click="toggleRoomGuestBox"
      class="w-full border font-raleway border-gray-300 rounded-lg px-4 py-2 text-left hover:border-black"
    >
      {{ formattedRoomGuest }}
    </button>

    <div
      v-if="showRoomGuestBox"
      class="absolute top-full left-0 bg-white border border-gray-300 rounded-lg shadow-md p-4 mt-2 z-10 w-full"
    >
      <!-- Room Selector -->
      <div class="flex items-center justify-between mb-4">
        <label>Rooms</label>
        <div class="flex items-center gap-2">
          <button
            @click="updateCount('rooms', -1)"
            class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            -
          </button>
          <span>{{ rooms }}</span>
          <button
            @click="updateCount('rooms', 1)"
            class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <!-- Guest Selector -->
      <div class="flex items-center justify-between">
        <label>Guests</label>
        <div class="flex items-center gap-2">
          <button
            @click="updateCount('guests', -1)"
            class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            -
          </button>
          <span>{{ guests }}</span>
          <button
            @click="updateCount('guests', 1)"
            class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Props
const props = defineProps({
  rooms: {
    type: Number,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
});

// Emits
const emit = defineEmits(['update-rooms', 'update-guests']);

// Local state
const localRooms = ref(props.rooms);
const localGuests = ref(props.guests);
const showRoomGuestBox = ref(false);

// Computed
const formattedRoomGuest = computed(() => `${localRooms.value} Room(s), ${localGuests.value} Guest(s)`);

// Watch for prop changes
watch(() => props.rooms, (newRooms) => {
  localRooms.value = newRooms;
});
watch(() => props.guests, (newGuests) => {
  localGuests.value = newGuests;
});

// Methods
const toggleRoomGuestBox = () => (showRoomGuestBox.value = !showRoomGuestBox.value);
const updateCount = (type: 'rooms' | 'guests', change: number) => {
  if (type === 'rooms') {
    const newRooms = Math.max(1, localRooms.value + change);
    localRooms.value = newRooms;
    emit('update-rooms', newRooms);
  }
  if (type === 'guests') {
    const newGuests = Math.max(1, localGuests.value + change);
    localGuests.value = newGuests;
    emit('update-guests', newGuests);
  }
};
const closeSelection = () => {
  showRoomGuestBox.value = false
}
</script>
