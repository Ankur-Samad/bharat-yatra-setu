const BOOKINGS_KEY = 'bharat-yatra-setu-bookings'
const DRAFT_KEY = 'bharat-yatra-setu-booking-draft'

export function calculateTotal(price, guests) {
  return price * guests
}

export function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`
}

export function createBookingId() {
  return `BYS-2026-${Math.floor(10000 + Math.random() * 89999)}`
}

export function saveBookingDraft(draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function getBookingDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') } catch { return null }
}

export function saveBooking(booking) {
  const bookings = getBookings()
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...bookings]))
  localStorage.removeItem(DRAFT_KEY)
}

export function updateBooking(bookingId, updates) {
  const bookings = getBookings().map((booking) => booking.bookingId === bookingId ? { ...booking, ...updates } : booking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  return bookings.find((booking) => booking.bookingId === bookingId)
}

export function getBookings() {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') } catch { return [] }
}

export function clearBookings() {
  localStorage.removeItem(BOOKINGS_KEY)
  localStorage.removeItem(DRAFT_KEY)
}
