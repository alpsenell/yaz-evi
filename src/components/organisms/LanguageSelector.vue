<script setup lang="ts">
import { ref } from "vue";
import i18next, { changeLanguage } from "i18next";
import YazDropdown from "../atoms/YazDropdown.vue";
import { LANGUAGES } from "../../enums/global.ts";
const selectedLanguage = ref(i18next.language<string>);
const selectLanguage = (language: string) => {
  changeLanguage(language);
  selectedLanguage.value = language;
}
</script>

<template>
  <YazDropdown
    :options="LANGUAGES"
    :selected-value="selectedLanguage"
    @select-value="selectLanguage"
  />
</template>

