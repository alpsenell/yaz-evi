<script setup lang="ts">

</script>

<template>
  <header class="header bg-white sticky top-0 items-center flex z-10">
    <div class="header__inner flex justify-between mx-auto w-[90%]">
      <img
        src="../assets/media/yaz-evi.svg"
        alt="Logo"
        class="w-[160px] h-auto"
      >

      <div class="header__right">
        <nav>
          <ul class="header__list flex flex-row items-center gap-4 justify-center">
            <li>
              <router-link class="header__link sub-link" to="/">Home</router-link>
            </li>
            <li>
              <router-link class="header__link sub-link" to="/gallery">Rooms</router-link>
            </li>
            <li>
              <router-link class="header__link sub-link" to="/dining">Dining</router-link>
            </li>
            <li>
              <router-link class="header__link sub-link" to="/about">About</router-link>
            </li>
            <li>
              <router-link class="header__link sub-link" to="/contact">Contact</router-link>
            </li>
          </ul>
        </nav>
        <div class="header__contact">
          <svg class="header__phone-icon" fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M11.748 5.773S11.418 5 10.914 5c-.496 0-.754.229-.926.387S6.938 7.91 6.938 7.91s-.837.731-.773 2.106c.054 1.375.323 3.332 1.719 6.058 1.386 2.72 4.855 6.876 7.047 8.337 0 0 2.031 1.558 3.921 2.191.549.173 1.647.398 1.903.398.26 0 .719 0 1.246-.385.536-.389 3.543-2.807 3.543-2.807s.736-.665-.119-1.438c-.859-.773-3.467-2.492-4.025-2.944-.559-.459-1.355-.257-1.699.054-.343.313-.956.828-1.031.893-.112.086-.419.365-.763.226-.438-.173-2.234-1.148-3.899-3.426-1.655-2.276-1.837-3.02-2.084-3.824a.56.56 0 0 1 .225-.657c.248-.172 1.161-.933 1.161-.933s.591-.583.344-1.27-1.906-4.716-1.906-4.716z"></path>
            </g>
          </svg>
          <a href="tel:+905303062021">0530 306 20 21</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 100vw;
  height: 130px;

  &__phone-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  &__right {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 24px;
  }

  &__contact {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  @media screen and (max-width: 768px) {
    &__right {
      display: none;
    }
  }
}
</style>
