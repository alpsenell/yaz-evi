import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackEvent } from './analytics'

afterEach(() => {
  delete (globalThis as Record<string, unknown>).window
})

describe('trackEvent', () => {
  it('calls testerify.customEvent with the event name', () => {
    const customEvent = vi.fn()
    ;(globalThis as Record<string, unknown>).window = { testerify: { customEvent } }
    trackEvent('room_selected')
    expect(customEvent).toHaveBeenCalledWith('room_selected')
  })

  it('does not throw when testerify is missing', () => {
    ;(globalThis as Record<string, unknown>).window = {}
    expect(() => trackEvent('x')).not.toThrow()
  })

  it('does not throw when window is undefined (SSR/build)', () => {
    delete (globalThis as Record<string, unknown>).window
    expect(() => trackEvent('x')).not.toThrow()
  })

  it('swallows errors thrown by customEvent', () => {
    ;(globalThis as Record<string, unknown>).window = {
      testerify: { customEvent: () => { throw new Error('boom') } },
    }
    expect(() => trackEvent('x')).not.toThrow()
  })
})
