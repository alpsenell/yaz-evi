import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('media utils', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('VITE_CDN_URL', 'https://media.yaz-evi.com')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('getMediaUrl', () => {
    it('returns a plain CDN url by default (resize disabled)', async () => {
      vi.stubEnv('VITE_CDN_RESIZE', '')
      const { getMediaUrl } = await import('./media')
      expect(getMediaUrl('oda_1/oda1.jpg')).toBe('https://media.yaz-evi.com/oda_1/oda1.jpg')
    })

    it('ignores width/format when resize is disabled', async () => {
      vi.stubEnv('VITE_CDN_RESIZE', '')
      const { getMediaUrl } = await import('./media')
      expect(getMediaUrl('a.jpg', { width: 800 })).toBe('https://media.yaz-evi.com/a.jpg')
    })

    it('builds a Cloudflare resize url when enabled', async () => {
      vi.stubEnv('VITE_CDN_RESIZE', 'true')
      const { getMediaUrl } = await import('./media')
      expect(getMediaUrl('a.jpg', { width: 800 })).toBe(
        'https://media.yaz-evi.com/cdn-cgi/image/width=800,format=auto/a.jpg',
      )
    })

    it('still returns the plain url when enabled but no options given', async () => {
      vi.stubEnv('VITE_CDN_RESIZE', 'true')
      const { getMediaUrl } = await import('./media')
      expect(getMediaUrl('a.jpg')).toBe('https://media.yaz-evi.com/a.jpg')
    })
  })

  describe('getMediaSrcset', () => {
    it('returns an empty string when resize is disabled', async () => {
      vi.stubEnv('VITE_CDN_RESIZE', '')
      const { getMediaSrcset } = await import('./media')
      expect(getMediaSrcset('a.jpg', [400, 800])).toBe('')
    })

    it('builds width-descriptor entries when enabled', async () => {
      vi.stubEnv('VITE_CDN_RESIZE', 'true')
      const { getMediaSrcset } = await import('./media')
      const srcset = getMediaSrcset('a.jpg', [400, 800])
      expect(srcset).toContain('width=400')
      expect(srcset).toContain('400w')
      expect(srcset).toContain('width=800')
      expect(srcset).toContain('800w')
    })
  })
})
