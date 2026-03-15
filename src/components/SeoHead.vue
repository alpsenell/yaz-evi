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

function setOrCreateLink(rel: string, hreflang: string, href: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.querySelector(selector) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

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

  const pageUrl = `https://www.yazevi.com${route.path}`

  setMeta('name', 'description', description.value)
  setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
  setMeta('name', 'author', 'Yaz Evi Bozcaada')
  setMeta('property', 'og:title', title.value)
  setMeta('property', 'og:description', description.value)
  setMeta('property', 'og:url', pageUrl)
  setMeta('property', 'og:locale', currentLang.value === 'tr' ? 'tr_TR' : 'en_US')
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', 'Yaz Evi Bozcaada')
  setMeta('property', 'og:image', 'https://www.yazevi.com/og-image.jpg')
  setMeta('property', 'og:image:alt', 'Yaz Evi Bozcaada Butik Otel')
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title.value)
  setMeta('name', 'twitter:description', description.value)
  setMeta('name', 'twitter:image', 'https://www.yazevi.com/og-image.jpg')

  // Canonical URL
  setOrCreateLink('canonical', '', pageUrl)

  // Hreflang tags
  setOrCreateLink('alternate', 'tr', pageUrl)
  setOrCreateLink('alternate', 'en', pageUrl)
  setOrCreateLink('alternate', 'x-default', pageUrl)
}

onMounted(updateMeta)
watch([title, description, currentLang, () => route.path], updateMeta)
</script>

<template>
  <div style="display: none" />
</template>
