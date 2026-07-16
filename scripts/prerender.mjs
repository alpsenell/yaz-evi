// Post-build prerender: writes a copy of dist/index.html per route with that
// route's <title>, meta description, canonical, hreflang, and Open Graph URLs.
//
// Why: this is a client-rendered SPA. Without this step every URL serves the
// homepage <head>, so crawlers see canonical=/ on all pages and social
// scrapers (which never run JS) always preview the homepage. Vercel serves
// static files before applying the SPA rewrite in vercel.json, so these files
// win for known routes while unknown paths still fall back to the SPA shell.
//
// Titles/descriptions are read from the seo block of src/languages/tr.ts
// (the site's primary language, matching <html lang="tr">) so there is a
// single source of truth shared with SeoHead.vue.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const SITE = 'https://www.yaz-evi.com'
const DIST = 'dist'

const ROUTES = [
  { path: '/', seoKey: 'home' },
  { path: '/about', seoKey: 'about' },
  { path: '/rooms', seoKey: 'rooms' },
  { path: '/room/zeus', seoKey: 'room' },
  { path: '/room/hera', seoKey: 'room' },
  { path: '/room/tenedos', seoKey: 'room' },
  { path: '/room/tenes', seoKey: 'room' },
  { path: '/room/ilyada', seoKey: 'room' },
  { path: '/gallery', seoKey: 'gallery' },
  { path: '/booking', seoKey: 'booking' },
  { path: '/checkout', seoKey: 'checkout' },
  { path: '/experiences', seoKey: 'experiences' },
  { path: '/contact', seoKey: 'contact' },
  { path: '/booking-terms', seoKey: 'bookingTerms' },
  { path: '/delivery-and-return', seoKey: 'deliveryAndReturn' },
  { path: '/privacy-policy', seoKey: 'privacyPolicy' },
  { path: '/distance-sales-agreement', seoKey: 'distanceSales' },
]

const trSource = readFileSync('src/languages/tr.ts', 'utf8')
const seoBlockMatch = trSource.match(/\n  seo: \{[\s\S]*?\n  \},/)
if (!seoBlockMatch) {
  throw new Error('prerender: could not locate the seo block in src/languages/tr.ts')
}
const seoBlock = seoBlockMatch[0]

function seoEntry(key) {
  const re = new RegExp(`\\b${key}:\\s*\\{\\s*title:\\s*"([^"]*)",\\s*description:\\s*"([^"]*)"`)
  const match = seoBlock.match(re)
  if (!match) {
    throw new Error(`prerender: seo.${key} not found in src/languages/tr.ts (title/description must be double-quoted)`)
  }
  return { title: match[1], description: match[2] }
}

function setValue(html, regex, value) {
  if (!regex.test(html)) {
    throw new Error(`prerender: pattern not found in template: ${regex}`)
  }
  return html.replace(regex, (_m, p1) => p1 + value)
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8')

for (const route of ROUTES) {
  const { title, description } = seoEntry(route.seoKey)
  const pageUrl = `${SITE}${route.path === '/' ? '/' : route.path}`

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
  html = setValue(html, /(<meta name="description" content=")[^"]*/, description)
  html = setValue(html, /(<link rel="canonical" href=")[^"]*/, pageUrl)
  html = setValue(html, /(<link rel="alternate" hreflang="tr" href=")[^"]*/, pageUrl)
  html = setValue(html, /(<link rel="alternate" hreflang="en" href=")[^"]*/, pageUrl)
  html = setValue(html, /(<link rel="alternate" hreflang="x-default" href=")[^"]*/, pageUrl)
  html = setValue(html, /(<meta property="og:title" content=")[^"]*/, title)
  html = setValue(html, /(<meta property="og:description" content=")[^"]*/, description)
  html = setValue(html, /(<meta property="og:url" content=")[^"]*/, pageUrl)
  html = setValue(html, /(<meta name="twitter:title" content=")[^"]*/, title)
  html = setValue(html, /(<meta name="twitter:description" content=")[^"]*/, description)

  const outFile = route.path === '/'
    ? join(DIST, 'index.html')
    : join(DIST, route.path.slice(1), 'index.html')
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)
}

console.log(`prerender: wrote ${ROUTES.length} route heads into ${DIST}/`)
