<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { ROOMS_V1, findRoom } from '../../data/rooms';
import HotelImage from '../atoms/HotelImage.vue';
import Eyebrow from '../atoms/Eyebrow.vue';
import YazIcon from '../atoms/YazIcon.vue';
import { getMediaUrl } from '../../utils/media';

const route = useRoute();
const router = useRouter();
const { i18next } = useTranslation();
const isTr = computed(() => i18next.language?.startsWith('tr'));
const lang = computed<'tr' | 'en'>(() => (isTr.value ? 'tr' : 'en'));

const room = computed(() => findRoom(String(route.params.slug)));
const idx = computed(() => (room.value ? ROOMS_V1.findIndex((r) => r.id === room.value!.id) : -1));
const prevRoom = computed(() => (idx.value < 0 ? null : ROOMS_V1[(idx.value - 1 + ROOMS_V1.length) % ROOMS_V1.length]));
const nextRoom = computed(() => (idx.value < 0 ? null : ROOMS_V1[(idx.value + 1) % ROOMS_V1.length]));

const detailRows = computed(() => {
  if (!room.value) return [];
  const r = room.value;
  if (lang.value === 'tr') {
    return [
      ['Kapasite', `${r.capacity} yetişkin`],
      ['Yatak', r.capacity === 3 ? '1 king + 1 tek' : '1 king-size'],
      ['Alan', `${r.area} m²`],
      ['Manzara', r.view.tr],
      ['Banyo', 'Özel · duşakabin'],
      ['Klima', 'Var'],
    ];
  }
  return [
    ['Capacity', `${r.capacity} adults`],
    ['Bed', r.capacity === 3 ? '1 king + 1 single' : '1 king-size'],
    ['Area', `${r.area} m²`],
    ['View', r.view.en],
    ['Bath', 'Private · walk-in'],
    ['AC', 'Yes'],
  ];
});

const amenities = computed(() => {
  if (lang.value === 'tr') {
    return ['Ücretsiz WiFi', 'Klima & ısıtma', 'Minibar', 'Bornoz & terlik', 'Saç kurutma', 'Günlük temizlik', 'Kişisel bakım', 'Oda servisi'];
  }
  return ['Free Wi-Fi', 'AC & heating', 'Minibar', 'Bathrobe & slippers', 'Hair dryer', 'Daily cleaning', 'Toiletries', 'Room service'];
});

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const allPhotos = computed(() => (room.value ? [...room.value.photos, ...room.value.bath] : []));

const openLightbox = (i: number) => {
  lightboxIndex.value = i;
  lightboxOpen.value = true;
};
const closeLightbox = () => { lightboxOpen.value = false; };
const prevImg = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + allPhotos.value.length) % allPhotos.value.length;
};
const nextImg = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % allPhotos.value.length;
};
const handleKey = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImg();
  if (e.key === 'ArrowRight') nextImg();
};
onMounted(() => window.addEventListener('keydown', handleKey));
onUnmounted(() => window.removeEventListener('keydown', handleKey));

const goBooking = () => {
  if (!room.value) return;
  router.push(`/booking?room=${room.value.slug}`);
};
</script>

<template>
  <div v-if="room" class="room-editorial bg-cream text-ink font-raleway font-light">
    <div class="px-6 md:px-16 pt-8">
      <router-link to="/rooms" class="text-[12px] tracking-nav uppercase font-medium text-ink no-underline opacity-80 hover:opacity-100">
        ← {{ $t('roomDetail.allRooms') }}
      </router-link>
    </div>

    <section class="px-6 md:px-16 pt-12 md:pt-16 pb-12 md:pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
        <div>
          <Eyebrow class="mb-8">{{ lang === 'tr' ? `Oda · 0${room.id}` : `Room · 0${room.id}` }}</Eyebrow>
          <h1
            class="font-display font-light m-0"
            style="font-size: clamp(80px, 14vw, 200px); line-height: 0.9; letter-spacing: -0.03em;"
          >
            {{ lang === 'tr' ? room.nameTr : room.nameEn }}
          </h1>
          <div class="font-display italic font-light mt-4 md:mt-6 text-peach" style="font-size: clamp(20px, 2.5vw, 28px);">
            {{ lang === 'tr' ? room.subTr : room.subEn }}
          </div>
        </div>
        <p class="text-[17px] leading-[1.7] opacity-85 max-w-[480px] m-0">
          {{ lang === 'tr' ? room.ledeTr : room.ledeEn }}
        </p>
      </div>
    </section>

    <section class="px-6 md:px-16 cursor-pointer" @click="openLightbox(0)">
      <HotelImage :src="room.photos[0]" :alt="`${room.name} hero`" class="h-[420px] md:h-[720px]" eager />
      <div v-if="room.placeholder" class="mt-3 text-[11px] tracking-nav uppercase opacity-50 text-right">
        {{ lang === 'tr' ? '* Geçici görseller — yeni çekim sezonu bekleniyor' : '* Temporary imagery — new photo shoot pending' }}
      </div>
    </section>

    <section class="px-6 md:px-16 py-20 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
      <div class="md:col-span-5">
        <Eyebrow class="mb-8">{{ lang === 'tr' ? 'Detay' : 'Detail' }}</Eyebrow>
        <div
          v-for="(row, i) in detailRows"
          :key="i"
          class="py-5 border-t border-ink/20 flex justify-between items-baseline gap-4"
        >
          <span class="text-[12px] tracking-widest3 uppercase opacity-55">{{ row[0] }}</span>
          <span class="font-display italic text-[20px] md:text-[22px]">{{ row[1] }}</span>
        </div>
      </div>
      <div class="md:col-span-7">
        <Eyebrow class="mb-8">{{ lang === 'tr' ? 'Olanaklar' : 'Amenities' }}</Eyebrow>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div v-for="(a, i) in amenities" :key="i" class="py-4 border-t border-ink/10 text-[16px]">
            {{ a }}
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 pb-12 md:pb-16">
      <div class="flex justify-between items-baseline mb-10">
        <h3 class="font-display font-light m-0" style="font-size: clamp(32px, 4vw, 48px); letter-spacing: -0.01em;">
          {{ lang === 'tr' ? 'Galeri' : 'Gallery' }}
        </h3>
        <span class="text-[11px] tracking-widest3 uppercase opacity-55">0{{ room.photos.length }}</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 room-gallery">
        <div
          v-for="(p, i) in room.photos.slice(1)"
          :key="p"
          class="cursor-pointer"
          :class="[
            i === 0 ? 'md:col-span-2 md:row-span-2' : '',
            i === 3 ? 'md:col-span-2' : '',
          ]"
          @click="openLightbox(i + 1)"
        >
          <HotelImage :src="p" :alt="p" :class="i === 0 ? 'h-[320px] md:h-[656px]' : 'h-[240px] md:h-[320px]'" />
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 py-16 md:py-20">
      <div class="flex justify-between items-baseline mb-8">
        <h3 class="font-display font-light m-0" style="font-size: clamp(28px, 3.5vw, 36px); letter-spacing: -0.01em;">
          {{ lang === 'tr' ? 'Banyo' : 'Bath' }}
        </h3>
        <span class="text-[11px] tracking-widest3 uppercase opacity-55">0{{ room.bath.length }}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="(p, i) in room.bath" :key="p" class="cursor-pointer" @click="openLightbox(room.photos.length + i)">
          <HotelImage :src="p" :alt="p" class="h-[260px] md:h-[360px]" />
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
      <div class="md:col-span-7">
        <Eyebrow class="mb-8">{{ lang === 'tr' ? 'Bir not' : 'A note' }}</Eyebrow>
        <blockquote
          class="font-display italic font-light m-0 text-muted"
          style="font-size: clamp(28px, 3.5vw, 40px); line-height: 1.25; letter-spacing: -0.005em;"
        >
          {{ lang === 'tr' ? room.quoteTr : room.quoteEn }}
        </blockquote>
      </div>
      <div class="md:col-span-5 bg-ink text-cream rounded-[4px] p-10 md:p-12">
        <div class="text-[11px] tracking-widest3 uppercase opacity-70 mb-4">
          {{ lang === 'tr' ? 'Gecelik · Mayıs–Eylül' : 'Per night · May–Sep' }}
        </div>
        <div
          class="font-display font-light mb-8"
          style="font-size: clamp(56px, 6vw, 80px); line-height: 0.95; letter-spacing: -0.02em;"
        >
          {{ room.price[lang] }}
        </div>
        <div class="h-px bg-cream/20 mb-8"></div>
        <button
          type="button"
          class="block w-full px-8 py-5 bg-peach text-ink rounded-full text-[12px] tracking-nav uppercase font-semibold border-none cursor-pointer"
          @click="goBooking"
        >
          {{ lang === 'tr' ? 'Bu odayı rezerve et' : 'Book this room' }} →
        </button>
      </div>
    </section>

    <section class="px-6 md:px-16 py-12 md:py-16 border-t border-ink/10 grid grid-cols-2 gap-8">
      <router-link v-if="prevRoom" :to="`/room/${prevRoom.slug}`" class="text-left text-ink no-underline">
        <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2">← {{ lang === 'tr' ? 'Önceki' : 'Previous' }}</div>
        <div class="font-display italic" style="font-size: clamp(22px, 3vw, 32px);">
          {{ lang === 'tr' ? prevRoom.nameTr : prevRoom.nameEn }}
        </div>
      </router-link>
      <router-link v-if="nextRoom" :to="`/room/${nextRoom.slug}`" class="text-right text-ink no-underline">
        <div class="text-[11px] tracking-widest3 uppercase opacity-55 mb-2">{{ lang === 'tr' ? 'Sonraki oda' : 'Next room' }} →</div>
        <div class="font-display italic" style="font-size: clamp(22px, 3vw, 32px);">
          {{ lang === 'tr' ? nextRoom.nameTr : nextRoom.nameEn }}
        </div>
      </router-link>
    </section>

    <Teleport to="body">
      <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center" @click.self="closeLightbox">
        <button
          type="button"
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-cream hover:bg-cream/10 rounded-full bg-transparent border-none cursor-pointer"
          @click="closeLightbox"
        >
          <YazIcon name="cross" color="white" :size="20" />
        </button>
        <button type="button" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-cream hover:bg-cream/10 rounded-full bg-transparent border-none cursor-pointer" @click="prevImg">
          <YazIcon name="left" color="white" :size="24" />
        </button>
        <img :src="getMediaUrl(allPhotos[lightboxIndex])" :alt="`${room.name} ${lightboxIndex + 1}`" class="max-h-[85vh] max-w-[90vw] object-contain" />
        <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-cream hover:bg-cream/10 rounded-full bg-transparent border-none cursor-pointer" @click="nextImg">
          <YazIcon name="right" color="white" :size="24" />
        </button>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-sm text-cream/70">
          {{ lightboxIndex + 1 }} / {{ allPhotos.length }}
        </div>
      </div>
    </Teleport>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-cream text-ink">
    <div class="text-center">
      <p class="font-raleway text-lg mb-4">Room not found</p>
      <router-link to="/rooms" class="px-6 py-3 border border-ink rounded-full text-[12px] tracking-nav uppercase no-underline text-ink">
        Back to Rooms
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room-editorial {
  scroll-snap-type: none;
  section {
    scroll-snap-align: none;
  }
}
.room-gallery {
  grid-auto-rows: 320px;
}
@media (max-width: 767px) {
  .room-gallery {
    grid-auto-rows: 240px;
  }
}
</style>
