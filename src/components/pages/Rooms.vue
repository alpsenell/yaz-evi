<script setup lang="ts">
import { ROOMS } from "../../enums/global.ts";
import { getMediaUrl } from '../../utils/media';
</script>

<template>
  <main class="rooms page-fade bg-cream">
    <!-- Sub hero -->
    <div class="relative h-[420px] md:h-[560px] overflow-hidden">
      <img
        :src="getMediaUrl('oda_1/oda1-min.jpg')"
        alt="Yaz Evi Bozcaada rooms"
        class="absolute inset-0 w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(16,32,40,0.5)] via-[rgba(16,32,40,0.2)] to-[rgba(16,32,40,0.5)]"></div>
      <div class="absolute left-0 right-0 top-[56%] -translate-y-1/2 text-center text-white px-6">
        <div class="eyebrow-light mb-5">{{ $t('v2.roomsPage.eyebrow') }}</div>
        <h1 class="font-serif font-light text-[44px] md:text-[58px] lg:text-[78px] m-0">{{ $t('v2.roomsPage.title') }}</h1>
      </div>
    </div>

    <!-- Room cards -->
    <div class="px-6 md:px-14 py-[70px] md:py-[110px]">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="room in ROOMS"
          :key="room.slug"
          class="bg-white border border-[#EBE2D0] overflow-hidden flex flex-col"
        >
          <router-link
            :to="`/room/${room.slug}`"
            class="relative block h-[260px] lg:h-[380px] overflow-hidden group"
          >
            <img
              :src="getMediaUrl(room.image)"
              :alt="room.name"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            >
          </router-link>
          <div class="p-7 flex flex-col flex-1">
            <h2 class="font-serif font-normal text-[30px] text-ink mt-0 mb-1.5 capitalize">{{ room.name }}</h2>
            <div class="flex flex-wrap gap-x-4 gap-y-1 font-jost text-[11px] tracking-[0.14em] uppercase text-azure mb-4">
              <span>{{ room.bookingInformation.size }} m²</span>
              <span>{{ room.bookingInformation.guestNumber }} {{ $t('v2.roomPage.guests') }}</span>
              <span>{{ room.bookingInformation.sleeps.map(s => $t(`roomInformation.${s}`)).join(' & ') }}</span>
            </div>
            <p class="font-jost font-light text-[14.5px] leading-[1.85] text-slate mt-0 mb-5 flex-1">
              {{ $t(`v2.roomShortDesc.${room.slug}`) }}
            </p>
            <div class="flex gap-5">
              <router-link :to="`/room/${room.slug}`" class="link-underline">{{ $t('v2.details') }}</router-link>
              <router-link :to="`/booking?room=${room.slug}`" class="link-underline-azure">{{ $t('v2.reserve') }}</router-link>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>
