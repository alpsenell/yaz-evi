/**
 * Post-build step: write a per-route index.html into dist/ with route-specific
 * <title>, description, canonical and OG/Twitter tags so non-JS crawlers
 * (WhatsApp, Facebook, Twitter, etc.) get the correct preview for each page.
 *
 * Run via `npm run build` (after `vite build`). The SPA still boots normally;
 * SeoHead.vue keeps updating meta on client-side navigation and language change.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import tr from '../src/languages/tr'
import { ROOMS } from '../src/enums/global'

const SITE = 'https://www.yaz-evi.com'
const distDir = join(process.cwd(), 'dist')
const templatePath = join(distDir, 'index.html')

type SeoEntry = { title: string; description: string }
const seo = (tr as { seo: Record<string, SeoEntry> }).seo

interface RouteMeta {
  path: string
  title: string
  description: string
}

function buildRoutes(): RouteMeta[] {
  const staticKeys: Array<[string, string]> = [
    ['/', 'home'],
    ['/about', 'about'],
    ['/rooms', 'rooms'],
    ['/gallery', 'gallery'],
    ['/booking', 'booking'],
    ['/experiences', 'experiences'],
    ['/contact', 'contact'],
    ['/booking-terms', 'bookingTerms'],
    ['/delivery-and-return', 'deliveryAndReturn'],
    ['/privacy-policy', 'privacyPolicy'],
    ['/distance-sales-agreement', 'distanceSales'],
  ]

  const routes: RouteMeta[] = staticKeys
    .filter(([, key]) => seo[key])
    .map(([path, key]) => ({ path, title: seo[key].title, description: seo[key].description }))

  // Per-room pages get a distinct title (room name) sharing the generic room description.
  for (const room of ROOMS) {
    routes.push({
      path: `/room/${room.slug}`,
      title: `${room.name} Odası | Yaz Evi Bozcaada Butik Otel`,
      description: seo.room?.description ?? '',
    })
  }

  return routes
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function applyMeta(template: string, meta: RouteMeta): string {
  const url = `${SITE}${meta.path === '/' ? '/' : meta.path}`
  const title = escapeAttr(meta.title)
  const desc = escapeAttr(meta.description)
  let html = template

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
  html = html.replace(/(<meta name="description"[^>]*content=")[^"]*(")/i, `$1${desc}$2`)
  html = html.replace(/(<meta property="og:title"[^>]*content=")[^"]*(")/i, `$1${title}$2`)
  html = html.replace(/(<meta property="og:description"[^>]*content=")[^"]*(")/i, `$1${desc}$2`)
  html = html.replace(/(<meta property="og:url"[^>]*content=")[^"]*(")/i, `$1${url}$2`)
  html = html.replace(/(<meta name="twitter:title"[^>]*content=")[^"]*(")/i, `$1${title}$2`)
  html = html.replace(/(<meta name="twitter:description"[^>]*content=")[^"]*(")/i, `$1${desc}$2`)
  html = html.replace(/(<link rel="canonical"[^>]*href=")[^"]*(")/i, `$1${url}$2`)
  html = html.replace(/(<link rel="alternate" hreflang="[^"]*" href=")[^"]*(")/gi, `$1${url}$2`)

  // Preload the LCP hero poster on the homepage (only if the CDN base is known).
  if (meta.path === '/' && process.env.VITE_CDN_URL) {
    const poster = `${process.env.VITE_CDN_URL}/homepage-3-min.jpg`
    html = html.replace(
      /<\/head>/i,
      `  <link rel="preload" as="image" href="${escapeAttr(poster)}" fetchpriority="high"/>\n</head>`,
    )
  }

  return html
}

async function main() {
  const template = await readFile(templatePath, 'utf8')
  const routes = buildRoutes()

  for (const route of routes) {
    const html = applyMeta(template, route)
    if (route.path === '/') {
      await writeFile(templatePath, html, 'utf8')
    } else {
      const dir = join(distDir, route.path.replace(/^\//, ''))
      await mkdir(dir, { recursive: true })
      await writeFile(join(dir, 'index.html'), html, 'utf8')
    }
  }

  console.log(`[prerender-meta] wrote ${routes.length} route HTML files`)
}

main().catch((err) => {
  console.error('[prerender-meta] failed:', err)
  process.exit(1)
})
