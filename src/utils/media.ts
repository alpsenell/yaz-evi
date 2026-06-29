const CDN_BASE = import.meta.env.VITE_CDN_URL as string

// On-the-fly resizing is opt-in. Leave VITE_CDN_RESIZE unset until the media
// CDN (media.yaz-evi.com) is confirmed to support Cloudflare Image Resizing.
// While off, getMediaUrl behaves exactly as before (plain pass-through).
const RESIZE_ENABLED = import.meta.env.VITE_CDN_RESIZE === 'true'

export interface MediaOptions {
  width?: number
  format?: 'auto' | 'webp' | 'avif'
}

export function getMediaUrl(path: string, opts: MediaOptions = {}): string {
  if (!RESIZE_ENABLED || (!opts.width && !opts.format)) {
    return `${CDN_BASE}/${path}`
  }

  const params: string[] = []
  if (opts.width) params.push(`width=${opts.width}`)
  params.push(`format=${opts.format ?? 'auto'}`)

  // Cloudflare Image Resizing path syntax.
  return `${CDN_BASE}/cdn-cgi/image/${params.join(',')}/${path}`
}

/**
 * Builds a responsive srcset string. Returns '' when resizing is disabled so
 * callers can bind it conditionally (`:srcset="getMediaSrcset(...) || undefined"`).
 */
export function getMediaSrcset(
  path: string,
  widths: number[],
  format: MediaOptions['format'] = 'auto',
): string {
  if (!RESIZE_ENABLED) return ''
  return widths.map((w) => `${getMediaUrl(path, { width: w, format })} ${w}w`).join(', ')
}
