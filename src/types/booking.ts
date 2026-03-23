import type { Timestamp } from 'firebase/firestore'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface GuestInfo {
  name: string
  email: string
  phone: string
  specialRequests?: string
}

export interface Booking {
  id?: string
  checkInDate: Date | Timestamp
  checkOutDate: Date | Timestamp
  nights: number
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests: string
  status: BookingStatus
  paymentId: string
  paymentToken: string
  paidAmount: number
  pricePerNight: number
  roomId: string
  roomName: string
  locale: 'en' | 'tr'
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
  bookingRef: string
}

export interface DateRange {
  start: Date
  end: Date
}

export interface RoomBookingInfo {
  price: number
  guestNumber: number
  sleeps: string[]
  bathroom: number
  size: number
  features: string[]
}

export interface Room {
  id: string
  title: string
  name: string
  image: string
  description: string
  bookingInformation: RoomBookingInfo
  images: string[]
}

export interface CheckoutState {
  room: Room
  checkIn: Date
  checkOut: Date
  nights: number
  guests: number
  rooms: number
  pricePerNight: number
  totalPrice: number
  locale: 'en' | 'tr'
}

export interface PaymentInitRequest {
  roomId: string
  checkIn: string
  checkOut: string
  guest: GuestInfo
  locale: 'en' | 'tr'
  nights: number
  pricePerNight: number
}

export interface PaymentInitResponse {
  checkoutFormContent: string
  token: string
  bookingId: string
}
