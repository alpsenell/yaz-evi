const CDN_BASE = import.meta.env.VITE_CDN_URL as string

export function getMediaUrl(path: string): string {
  return `${CDN_BASE}/${path}`
}
