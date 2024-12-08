<script setup lang="ts">
import { ref, watch } from "vue";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { useRoute } from 'vue-router'
import db from "./firebase";
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import MenuDrawer from "./components/organisms/MenuDrawer.vue";

const menuVisibility = ref(false);

const toggleMobileMenu = () => {
  menuVisibility.value = !menuVisibility.value
}
const route = useRoute()

watch(
  () => route.path,
  () => {
    toggleMobileMenu()
  }
)

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
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
})
</script>

<template>
  <div>
    <Header
      :menuVisibility="menuVisibility"
      @toggleMobileMenu="toggleMobileMenu"
    />
    <router-view />
    <Footer />
  </div>
  <MenuDrawer
    :visibility="menuVisibility"
    @toggleMobileMenu="toggleMobileMenu"
  />

<!--  <button @click="getRooms">Get Rooms</button>-->
<!--  <button @click="createRoom">Create room</button>-->
</template>
