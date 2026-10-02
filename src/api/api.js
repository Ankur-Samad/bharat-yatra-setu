const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest
  })

  if (response.status === 204) {
    return null
  }

  const isJson = (response.headers.get('content-type') || '')
    .includes('application/json')

  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(
      data?.message || 'Request failed. Please try again.'
    )
  }

  return data
}

export async function getExperiences() {
  return request('/api/experiences')
}

export async function getExperience(id) {
  return request(`/api/experiences/${id}`)
}

export async function createExperience(experienceData) {
  return request('/api/experiences', {
    method: 'POST',
    body: experienceData
  })
}

export async function updateExperience(id, experienceData) {
  return request(`/api/experiences/${id}`, {
    method: 'PUT',
    body: experienceData
  })
}

export async function deleteExperience(id) {
  return request(`/api/experiences/${id}`, {
    method: 'DELETE'
  })
}

export async function createBooking(bookingData) {
  return request('/api/bookings', {
    method: 'POST',
    body: bookingData
  })
}

export async function getBookings() {
  return request('/api/bookings')
}

export async function updateBackendBooking(bookingId, updates) {
  return request(`/api/bookings/${bookingId}`, {
    method: 'PUT',
    body: updates
  })
}
