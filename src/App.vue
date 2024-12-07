<script setup lang="ts">
import { ref, watch } from "vue";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import db from "./firebase";
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import SlidingHeader from "./components/organisms/SlidingHeader.vue";

const menuVisibility = ref(false);
const headerHeight = ref(0);

const openMenu = () => {
  headerHeight.value = document.querySelector('.header')?.clientHeight

  menuVisibility.value = !menuVisibility.value
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

watch(menuVisibility, (value) => {
  if (value) {
    document.body.style.position = 'fixed'
  } else {
    document.body.style.position = 'unset'
  }
})
</script>

<template>
  <div>
    <Header @openMenu="openMenu" />
    <router-view />
    <Footer />
  </div>
  <SlidingHeader
    class="fixed w-dvw bg-white top-0 transition-transform z-10"
  />

<!--  <button @click="getRooms">Get Rooms</button>-->
<!--  <button @click="createRoom">Create room</button>-->
</template>
