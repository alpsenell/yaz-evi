import { ROOMS } from '../enums/global'
import type { CheckoutState, Room } from '../types/booking'

const STORAGE_KEY = 'bookingState'

export function useBookingState() {
  const saveState = (state: {
    roomId: string
    checkIn: string
    checkOut: string
    nights: number
    guests: number
    rooms: number
    pricePerNight: number
    totalPrice: number
    locale: string
  }) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  const getState = (): CheckoutState | null => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw)
      const room = ROOMS.find((r) => r.id === parsed.roomId)
      if (!room) return null

      return {
        room,
        checkIn: new Date(parsed.checkIn),
        checkOut: new Date(parsed.checkOut),
        nights: parsed.nights,
        guests: parsed.guests,
        rooms: parsed.rooms,
        pricePerNight: parsed.pricePerNight,
        totalPrice: parsed.totalPrice,
        locale: parsed.locale as 'en' | 'tr',
      }
    } catch {
      return null
    }
  }

  const clearState = () => {
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const isValid = (): boolean => {
    return getState() !== null
  }

  return { saveState, getState, clearState, isValid }
}
