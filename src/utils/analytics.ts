declare global {
  interface Window {
    testerify?: { customEvent: (name: string) => void }
  }
}

export const trackEvent = (name: string) => {
  try {
    window.testerify?.customEvent(name)
  } catch {
    // Analytics must never break the UI.
  }
}

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)
