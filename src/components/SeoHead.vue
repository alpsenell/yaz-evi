<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTranslation } from 'i18next-vue'

const { t, i18next } = useTranslation()
const route = useRoute()

const seoKey = computed(() => (route.meta.seoKey as string) || 'home')
const currentLang = computed(() => i18next.language?.startsWith('tr') ? 'tr' : 'en')
const title = computed(() => t(`seo.${seoKey.value}.title`))
const description = computed(() => t(`seo.${seoKey.value}.description`))

function updateMeta() {
  document.title = title.value
  document.documentElement.lang = currentLang.value

  const setMeta = (attr: string, key: string, value: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr === 'property' ? 'property' : 'name', key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', value)
  }

  setMeta('name', 'description', description.value)
  setMeta('property', 'og:title', title.value)
  setMeta('property', 'og:description', description.value)
  setMeta('property', 'og:url', `https://www.yazevi.com${route.path}`)
  setMeta('property', 'og:locale', currentLang.value === 'tr' ? 'tr_TR' : 'en_US')
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', 'Yaz Evi')
  setMeta('property', 'og:image', 'https://www.yazevi.com/og-image.jpg')
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title.value)
  setMeta('name', 'twitter:description', description.value)
  setMeta('name', 'twitter:image', 'https://www.yazevi.com/og-image.jpg')
  setMeta('name', 'robots', 'index, follow')
  setMeta('name', 'author', 'Yaz Evi')

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', `https://www.yazevi.com${route.path}`)
}

onMounted(updateMeta)
watch([title, description, currentLang, () => route.path], updateMeta)
</script>

<template>
  <div style="display: none" />
</template>
