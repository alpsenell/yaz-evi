<script setup lang="ts">
import { ref } from "vue";
import i18next, { changeLanguage } from "i18next";
import YazDropdown from "../atoms/YazDropdown.vue";
import { LANGUAGES } from "../../enums/global.ts";

const selectedLanguage = ref(i18next.language<string> || 'en');
const selectLanguage = (language: string) => {
  changeLanguage(language);
  selectedLanguage.value = language;
}
const props = withDefaults(defineProps(), {
  openPosition: 'down',
})
</script>

<template>
  <YazDropdown
    :options="LANGUAGES"
    :selected-value="selectedLanguage"
    :open-position="props.openPosition"
    @select-value="selectLanguage"
  />
</template>

