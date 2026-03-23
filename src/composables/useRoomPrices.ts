import { ref } from 'vue'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

const prices = ref<Map<string, number>>(new Map())
const loading = ref(false)
const loaded = ref(false)

export function useRoomPrices() {
  const fetchPrices = async () => {
    if (loaded.value) return
    loading.value = true

    try {
      const roomsRef = collection(db, 'rooms')
      const snapshot = await getDocs(roomsRef)

      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.pricePerNight != null) {
          prices.value.set(doc.id, data.pricePerNight)
        }
      })

      loaded.value = true
    } catch (error) {
      console.error('Failed to fetch room prices:', error)
    } finally {
      loading.value = false
    }
  }

  const getPrice = (roomId: string): number | null => {
    return prices.value.get(roomId) ?? null
  }

  return {
    prices,
    loading,
    fetchPrices,
    getPrice,
  }
}
