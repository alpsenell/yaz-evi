<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from 'vue-router'
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
    menuVisibility.value = false
  }
)

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
</template>
