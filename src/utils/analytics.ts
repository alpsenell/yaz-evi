// Lightweight wrapper around the Testerify analytics global.
// Always guarded: analytics must never break the app, even if the script is
// blocked by an ad-blocker or has not loaded yet.

declare global {
  interface Window {
    testerify?: {
      customEvent?: (name: string) => void
    }
  }
}

export function trackEvent(name: string): void {
  if (typeof window === 'undefined') return
  try {
    window.testerify?.customEvent?.(name)
  } catch {
    /* swallow — analytics failures must never surface to the user */
  }
}
