<script setup lang="ts">
import { ref, watch } from "vue";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import db from "./firebase";
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { HEADER_MENU_ITEMS } from "./enums/global.ts";
import LanguageSelector from "./components/organisms/LanguageSelector.vue";

const mobileMenu = ref(false);
const headerHeight = ref(0);

const openMobileMenu = () => {
  headerHeight.value = document.querySelector('.header')?.clientHeight

  mobileMenu.value = !mobileMenu.value
}

async function getRooms() {
  const q = query(collection(db, "rooms"), where("room_id", "==", 1));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

async function createRoom() {
  const roomsRef = collection(db, "rooms");

  await setDoc(doc(roomsRef, "7YqZsdCoa5RgiUTsnr7K"), {
    capacity: 2, description: "test", price: 400,
    room_id: 2, room_name: 'test oda',
  });
}

watch(mobileMenu, (value) => {
  if (value) {
    document.body.style.position = 'fixed'
  } else {
    document.body.style.position = 'unset'
  }
})

</script>

<template>
  <div>
    <Header @openMobileMenu="openMobileMenu" />
    <router-view />
    <Footer />
  </div>
<!--  <button @click="getRooms">Get Rooms</button>-->
<!--  <button @click="createRoom">Create room</button>-->
  <div
    class="fixed w-dvw bg-white top-0 transition-transform z-10"
    :class="{ 'translate-x-0': mobileMenu, 'translate-x-full': !mobileMenu }"
    :style="{ height: `calc(100dvh - ${headerHeight}px)`, top: `${headerHeight}px` }"
  >
    <nav class="h-full">
      <ul class="header__list h-full flex flex-col items-center gap-4 justify-center overflow-auto">
        <li v-for="item in HEADER_MENU_ITEMS">
          <router-link
            class="header__link sub-link text-xl"
            :to=item.url
            @click="mobileMenu = false"
          >
            {{ $t(`${item.title}`) }}
          </router-link>
        </li>
        <LanguageSelector open-position="up" />
      </ul>
    </nav>
  </div>
</template>
