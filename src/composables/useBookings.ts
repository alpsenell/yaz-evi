import { ref } from 'vue'
import { db } from '../firebase/config'
import { collection, getDocs, doc } from 'firebase/firestore'
import type { DateRange } from '../types/booking'
import { ROOMS } from '../enums/global'

const allBookings = ref<Map<string, DateRange[]>>(new Map())
const loading = ref(false)
const loaded = ref(false)

export function useBookings() {
  const fetchAllBookings = async () => {
    if (loaded.value) return
    loading.value = true

    try {
      const bookingsMap = new Map<string, DateRange[]>()

      for (const room of ROOMS) {
        const roomRef = doc(db, 'rooms', room.id)
        const bookingsRef = collection(roomRef, 'bookings')
        const snapshot = await getDocs(bookingsRef)

        const ranges: DateRange[] = []
        snapshot.forEach((docSnap) => {
          const data = docSnap.data()
          // Skip cancelled bookings (old bookings without status are treated as confirmed)
          if (data.status === 'cancelled') return

          const checkIn = data.checkInDate?.toDate ? data.checkInDate.toDate() : new Date(data.checkInDate)
          const checkOut = data.checkOutDate?.toDate ? data.checkOutDate.toDate() : new Date(data.checkOutDate)
          ranges.push({ start: checkIn, end: checkOut })
        })

        bookingsMap.set(room.id, ranges)
      }

      allBookings.value = bookingsMap
      loaded.value = true
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      loading.value = false
    }
  }

  const refetchBookings = async () => {
    loaded.value = false
    await fetchAllBookings()
  }

  const getBookingsForRoom = (roomId: string): DateRange[] => {
    return allBookings.value.get(roomId) ?? []
  }

  const getDisabledDates = (roomId?: string): DateRange[] => {
    if (roomId) {
      return getBookingsForRoom(roomId)
    }

    // Intersection: dates where ALL rooms are booked
    const roomIds = Array.from(allBookings.value.keys())
    if (roomIds.length === 0) return []

    // For a small boutique hotel (5 rooms), compute day-level intersection
    const firstRoom = allBookings.value.get(roomIds[0]) ?? []
    if (firstRoom.length === 0) return []

    const isDateBookedForRoom = (date: Date, roomId: string): boolean => {
      const bookings = allBookings.value.get(roomId) ?? []
      return bookings.some((range) => {
        return date >= range.start && date < range.end
      })
    }

    const isDateBookedForAll = (date: Date): boolean => {
      return roomIds.every((id) => isDateBookedForRoom(date, id))
    }

    // Scan next 365 days to find fully-booked dates
    const disabledDates: Date[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() + i)
      if (isDateBookedForAll(checkDate)) {
        disabledDates.push(checkDate)
      }
    }

    // Convert individual dates to ranges for v-calendar
    if (disabledDates.length === 0) return []

    const ranges: DateRange[] = []
    let rangeStart = disabledDates[0]
    let prev = disabledDates[0]

    for (let i = 1; i < disabledDates.length; i++) {
      const curr = disabledDates[i]
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays > 1) {
        ranges.push({ start: new Date(rangeStart), end: new Date(prev) })
        rangeStart = curr
      }
      prev = curr
    }
    ranges.push({ start: new Date(rangeStart), end: new Date(prev) })

    return ranges
  }

  const getCalendarAttributes = (roomId?: string) => {
    const ranges = roomId ? getBookingsForRoom(roomId) : []

    if (ranges.length === 0 && !roomId) return []

    return ranges.map((range, index) => ({
      key: `booked-${index}`,
      highlight: {
        color: 'red',
        fillMode: 'light',
      },
      dates: { start: range.start, end: range.end },
      popover: {
        label: 'Booked',
      },
    }))
  }

  return {
    allBookings,
    loading,
    fetchAllBookings,
    refetchBookings,
    getBookingsForRoom,
    getDisabledDates,
    getCalendarAttributes,
  }
}
