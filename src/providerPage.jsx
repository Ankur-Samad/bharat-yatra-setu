import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { experiences } from './data'
import {
  Badge,
  Button,
  DashboardLayout,
  EmptyState,
  Status,
  TrustScore
} from './components'
import {
  formatCurrency,
  getBookings,
  updateBooking
} from './utils/booking'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function getBackendBookings() {
  const response = await fetch(`${API_BASE_URL}/api/bookings`)

  if (!response.ok) {
    throw new Error('Failed to fetch backend bookings')
  }

  return response.json()
}

async function updateBackendBooking(bookingId, updates) {
  const response = await fetch(
    `${API_BASE_URL}/api/bookings/${bookingId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update backend booking')
  }

  return response.json()
}

const PROVIDER = {
  name: 'Ravi Sharma',
  role: 'Local Heritage Guide',
  location: 'Jaipur, Rajasthan',
  id: 'PROV-001',
  trust: 96
}

const STORE_KEY = 'bharat-yatra-setu-provider-experiences'

const baseExperiences = experiences
  .filter((item) =>
    ['amer-fort', 'old-jaipur', 'jaipur-food'].includes(item.id)
  )
  .map((item) => ({
    ...item,
    provider: PROVIDER.name
  }))

const readExperiences = () => {
  try {
    return (
      JSON.parse(
        localStorage.getItem(STORE_KEY) || 'null'
      ) || baseExperiences
    )
  } catch {
    return baseExperiences
  }
}

function Metric({ label, value, detail, tone = '' }) {
  return (
    <div className={`provider-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}

function Profile() {
  return (
    <div className="provider-profile-strip">
      <div className="provider-avatar">RS</div>

      <div>
        <span className="eyebrow">
          PROVIDER ID · {PROVIDER.id}
        </span>

        <h2>{PROVIDER.name}</h2>

        <p>
          {PROVIDER.role} · {PROVIDER.location}
        </p>
      </div>

      <div className="provider-profile-status">
        <Status tone="blue">
          Profile Verified
        </Status>

        <small>
          Simulated verification for prototype
        </small>
      </div>

      <TrustScore
        score={PROVIDER.trust}
        compact
      />
    </div>
  )
}

function Request({
  booking,
  item,
  accept,
  decline,
  open
}) {
  const pending =
    booking.providerStatus !== 'ACCEPTED' &&
    booking.providerStatus !== 'DECLINED' &&
    booking.status !== 'DECLINED'

  return (
    <article
      className={`provider-booking-card ${
        pending ? 'is-new' : ''
      }`}
      onClick={() => open(booking)}
    >
      <div className="booking-request-main">
        <div className="request-avatar">
          {(booking.touristName || 'Demo Tourist')
            .split(' ')
            .map((part) => part[0])
            .join('')}
        </div>

        <div>
          <span className="card-kicker">
            {pending
              ? 'NEW BOOKING REQUEST'
              : booking.providerStatus ||
                booking.status}
          </span>

          <h3>
            {item?.title || 'Experience'}
          </h3>

          <p>
            {booking.touristName || 'Demo Tourist'} ·{' '}
            {booking.date} · {booking.time}
          </p>
        </div>
      </div>

      <div className="booking-request-meta">
        <span>
          {booking.guests} guest
          {booking.guests === 1 ? '' : 's'}
        </span>

        <strong>
          {formatCurrency(
            booking.amount ?? booking.total ?? 0
          )}
        </strong>

        <span className="payment-status">
          {booking.paymentStatus || 'PAID'}
        </span>
      </div>

      {pending && (
        <div className="booking-actions">
          <button
            className="accept-button"
            onClick={(event) => {
              event.stopPropagation()
              accept(booking)
            }}
          >
            Accept
          </button>

          <button
            className="decline-button"
            onClick={(event) => {
              event.stopPropagation()
              decline(booking)
            }}
          >
            Decline
          </button>
        </div>
      )}
    </article>
  )
}

function TrustBreakdown() {
  const scores = [
    ['Identity / Profile', '30/30'],
    ['Experience Information', '18/20'],
    ['Documentation Signals', '20/20'],
    ['Reviews', '14/15'],
    ['Booking Reliability', '9/10'],
    ['Profile Completeness', '5/5']
  ]

  return (
    <section className="provider-panel trust-breakdown">
      <div className="provider-panel-heading">
        <div>
          <span className="panel-eyebrow">
            SIMULATED SCORING MODEL
          </span>

          <h2>Your Trust Profile</h2>
        </div>

        <TrustScore score={PROVIDER.trust} />
      </div>

      <p className="prototype-note">
        Prototype trust score based on simulated
        verification and activity signals.
      </p>

      <div className="trust-breakdown-list">
        {scores.map(([label, score]) => (
          <div key={label}>
            <span>{label}</span>

            <strong>{score}</strong>

            <i>
              <b
                style={{
                  width: `${
                    (Number(score.split('/')[0]) /
                      Number(score.split('/')[1])) *
                    100
                  }%`
                }}
              />
            </i>
          </div>
        ))}
      </div>
    </section>
  )
}

function AddExperience({ close, save }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Heritage',
    description: '',
    price: '',
    duration: '2 hours',
    languages: 'Hindi · English',
    maxGuests: '6'
  })

  const set = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }))
  }

  const valid =
    form.name &&
    form.description &&
    form.price

  return (
    <div className="modal-backdrop">
      <form
        className="modal add-experience-modal"
        onSubmit={(event) => {
          event.preventDefault()

          if (valid) {
            save(form)
          }
        }}
      >
        <button
          type="button"
          className="modal-close"
          onClick={close}
        >
          ×
        </button>

        <div className="eyebrow">
          NEW EXPERIENCE
        </div>

        <h2>Add an experience</h2>

        <label>
          Experience name

          <input
            value={form.name}
            onChange={(event) =>
              set('name', event.target.value)
            }
            placeholder="e.g. Amer Fort at Dawn"
          />
        </label>

        <label>
          Category

          <select
            value={form.category}
            onChange={(event) =>
              set('category', event.target.value)
            }
          >
            <option>Heritage</option>
            <option>Craft</option>
            <option>Food</option>
            <option>Story</option>
          </select>
        </label>

        <label>
          Description

          <textarea
            value={form.description}
            onChange={(event) =>
              set(
                'description',
                event.target.value
              )
            }
            placeholder="What makes this local experience special?"
          />
        </label>

        <div className="add-form-grid">
          <label>
            Price

            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) =>
                set('price', event.target.value)
              }
            />
          </label>

          <label>
            Duration

            <input
              value={form.duration}
              onChange={(event) =>
                set(
                  'duration',
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Languages

            <input
              value={form.languages}
              onChange={(event) =>
                set(
                  'languages',
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Maximum guests

            <input
              type="number"
              min="1"
              value={form.maxGuests}
              onChange={(event) =>
                set(
                  'maxGuests',
                  event.target.value
                )
              }
            />
          </label>
        </div>

        <button
          className="button"
          disabled={!valid}
        >
          Save experience <span>↗</span>
        </button>
      </form>
    </div>
  )
}

function ExperienceList({
  items,
  add,
  voiceAvailability,
  onUpdated
}) {
  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const matchesVoiceExperience = (item) => {
    if (!voiceAvailability?.experience) {
      return false
    }

    const itemTitle = item.title.toLowerCase()
    const voiceTitle = voiceAvailability.experience.toLowerCase()

    return (
      (itemTitle.includes('amer fort') &&
        voiceTitle.includes('amer fort')) ||
      itemTitle.includes(voiceTitle) ||
      voiceTitle.includes(itemTitle)
    )
  }

  const openEdit = (item) => {
    setEditItem({
      ...item,
      price: Number(item.price || 0),
      maxGuests: Number(item.maxGuests || 1)
    })
  }

  const saveEdit = async () => {
    if (!editItem) return

    setSavingEdit(true)

    try {
      const payload = {
        title: editItem.title,
        category: editItem.category,
        description: editItem.description,
        price: Number(editItem.price),
        duration: editItem.duration,
        languages: editItem.languages,
        maxGuests: Number(editItem.maxGuests),
        city: editItem.city || 'Jaipur',
        location: editItem.location || 'Jaipur, Rajasthan',
        provider: editItem.provider || 'Ravi Sharma',
        providerType:
          editItem.providerType || 'Local Heritage Guide',
        rating: Number(editItem.rating) || 4.5,
        reviewCount: Number(editItem.reviewCount) || 0,
        trustScore: Number(editItem.trustScore || editItem.trust || 88),
        meetingPoint: editItem.meetingPoint || 'Jaipur',
        image: editItem.image || experiences[0].image
      }

      const numericId = Number(editItem.id)

      if (Number.isFinite(numericId)) {
        const response = await fetch(
          `${API_BASE_URL}/api/experiences/${numericId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || 'Failed to update experience')
        }

        const updated = await response.json()
        onUpdated(updated)
        localStorage.setItem(
          STORE_KEY,
          JSON.stringify(
            items.map((item) =>
              item.id === updated.id
                ? { ...item, ...updated }
                : item
            )
          )
        )
      } else {
        const updated = { ...editItem, ...payload }
        const next = items.map((item) =>
          item.id === editItem.id ? updated : item
        )
        onUpdated(updated, next)
        localStorage.setItem(STORE_KEY, JSON.stringify(next))
      }

      window.alert('Experience updated successfully!')
      setEditItem(null)
    } catch (error) {
      console.error('Edit experience error:', error)
      window.alert(
        `Experience update failed: ${error.message || 'Please check the backend.'}`
      )
    } finally {
      setSavingEdit(false)
    }
  }

  const updateEditField = (field, value) => {
    setEditItem((current) => ({
      ...current,
      [field]: value
    }))
  }

  return (
    <section className="provider-panel experience-manager">
      <div className="provider-panel-heading">
        <div>
          <span className="panel-eyebrow">YOUR OFFERINGS</span>
          <h2>My Experiences</h2>
        </div>

        <Button onClick={add}>Add Experience</Button>
      </div>

      <div className="provider-experience-list">
        {items.map((item) => (
          <article
            className="provider-experience-row"
            key={item.id}
          >
            <img src={item.image} alt={item.title} />

            <div>
              <span className="card-kicker">
                {item.category}
              </span>

              <h3>{item.title}</h3>

              <p>
                {formatCurrency(item.price)} · {item.duration} · ★{' '}
                {item.rating}
              </p>

              {voiceAvailability &&
                matchesVoiceExperience(item) && (
                  <small
                    style={{
                      display: 'block',
                      marginTop: '8px',
                      fontWeight: '600'
                    }}
                  >
                    🎤 {voiceAvailability.status} ·{' '}
                    {voiceAvailability.date} ·{' '}
                    {voiceAvailability.time}
                  </small>
                )}
            </div>

            <Badge tone="gold">
              TRUST {item.trustScore || item.trust}
            </Badge>

            <div className="experience-row-actions">
              <button onClick={() => setViewItem(item)}>
                View
              </button>
              <button onClick={() => openEdit(item)}>
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>

      {viewItem && (
        <div className="modal-backdrop">
          <div
            className="modal"
            style={{ maxWidth: '650px', width: '92%', margin: '0 auto' }}
          >
            <button
              type="button"
              onClick={() => setViewItem(null)}
              style={{ float: 'right' }}
            >
              ✕
            </button>

            <img
              src={viewItem.image}
              alt={viewItem.title}
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />

            <span
              className="card-kicker"
              style={{ display: 'block', marginTop: '18px' }}
            >
              {viewItem.category}
            </span>

            <h2>{viewItem.title}</h2>

            <p>{viewItem.description}</p>

            <p>
              <strong>Price:</strong>{' '}
              {formatCurrency(viewItem.price)}
            </p>
            <p>
              <strong>Duration:</strong> {viewItem.duration}
            </p>
            <p>
              <strong>Languages:</strong> {viewItem.languages}
            </p>
            <p>
              <strong>Max Guests:</strong> {viewItem.maxGuests}
            </p>
            <p>
              <strong>Meeting Point:</strong>{' '}
              {viewItem.meetingPoint || 'Jaipur'}
            </p>

            <Button onClick={() => setViewItem(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {editItem && (
        <div className="modal-backdrop">
          <div
            className="modal"
            style={{ maxWidth: '650px', width: '92%' }}
          >
            <button
              type="button"
              onClick={() => setEditItem(null)}
              style={{ float: 'right' }}
              disabled={savingEdit}
            >
              ✕
            </button>

            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Edit Experience</h2>

            <div
              style={{
                display: 'grid',
                gap: '14px',
                marginTop: '18px',
                maxWidth: '560px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontWeight: '600' }}>
                Title
                <input
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editItem.title || ''}
                  onChange={(e) =>
                    updateEditField('title', e.target.value)
                  }
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontWeight: '600' }}>
                Category
                <input
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editItem.category || ''}
                  onChange={(e) =>
                    updateEditField('category', e.target.value)
                  }
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontWeight: '600' }}>
                Description
                <textarea
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                  value={editItem.description || ''}
                  onChange={(e) =>
                    updateEditField('description', e.target.value)
                  }
                  rows="4"
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontWeight: '600' }}>
                Price
                <input
                  type="number"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editItem.price ?? ''}
                  onChange={(e) =>
                    updateEditField('price', e.target.value)
                  }
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontWeight: '600' }}>
                Duration
                <input
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editItem.duration || ''}
                  onChange={(e) =>
                    updateEditField('duration', e.target.value)
                  }
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontWeight: '600' }}>
                Languages
                <input
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editItem.languages || ''}
                  onChange={(e) =>
                    updateEditField('languages', e.target.value)
                  }
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontWeight: '600' }}>
                Max Guests
                <input
                  type="number"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editItem.maxGuests ?? ''}
                  onChange={(e) =>
                    updateEditField('maxGuests', e.target.value)
                  }
                />
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '10px',
                  justifyContent: 'center'
                }}
              >
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={savingEdit}
                  style={{
                    flex: '1 1 0',
                    minHeight: '50px',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#293766',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: savingEdit ? 'not-allowed' : 'pointer'
                  }}
                >
                  {savingEdit ? 'Saving...' : 'Save Changes ↗'}
                </button>

                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  disabled={savingEdit}
                  style={{
                    flex: '1 1 0',
                    minHeight: '50px',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#293766',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: savingEdit ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


export function ProviderPage() {
  const [bookings, setBookings] =
    useState(() => getBookings())

  const [backendConnected, setBackendConnected] =
    useState(false)

  // Load bookings from Spring Boot backend.
  useEffect(() => {
    let active = true

    const loadBookings = async () => {
      try {
        const data = await getBackendBookings()

        if (!active || !Array.isArray(data)) {
          return
        }

        // Convert backend booking wrapper into the same
        // shape already used by the provider dashboard.
        const backendBookings = data.map((record) => {
          const booking = record.booking || {}

          return {
            ...booking,
            bookingId:
              record.bookingId ||
              record.id ||
              booking.bookingId ||
              booking.id,
            amount: Number(
              booking.amount ??
              booking.total ??
              record.amount ??
              record.total ??
              0
            ),
            status:
              record.status ||
              booking.status ||
              'PENDING',
            paymentStatus:
              record.paymentStatus ||
              booking.paymentStatus ||
              'SUCCESS',
            providerStatus:
              record.providerStatus ||
              booking.providerStatus ||
              null
          }
        })

        setBookings(backendBookings)
        setBackendConnected(true)
      } catch (error) {
        console.error(
          'Provider booking API error:',
          error
        )

        // Keep local prototype bookings available
        // if the backend is temporarily unavailable.
        setBookings(getBookings())
        setBackendConnected(false)
      }
    }

    loadBookings()

    const handleFocus = () => {
      loadBookings()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      active = false
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Keep local prototype bookings synced as well.
  useEffect(() => {
    const syncLocalBookings = () => {
      if (!backendConnected) {
        setBookings(getBookings())
      }
    }

    window.addEventListener('storage', syncLocalBookings)

    return () => {
      window.removeEventListener(
        'storage',
        syncLocalBookings
      )
    }
  }, [backendConnected])

  const [providerExperiences, setProviderExperiences] =
    useState(() => readExperiences())

  const [tab, setTab] =
    useState('New Requests')

  const [notice, setNotice] =
    useState('')

  const [selected, setSelected] =
    useState(null)

  const [adding, setAdding] =
    useState(false)

  let voiceAvailability = null

  try {
    voiceAvailability = JSON.parse(
      localStorage.getItem(
        'bharat-yatra-setu-voice-availability'
      ) || 'null'
    )
  } catch {
    voiceAvailability = null
  }

  const itemFor = (booking) =>
    experiences.find(
      (item) =>
        item.id === booking.experienceId
    ) ||
    providerExperiences.find(
      (item) =>
        item.id === booking.experienceId
    )

  const pending = bookings.filter(
    (booking) =>
      booking.providerStatus !== 'ACCEPTED' &&
      booking.providerStatus !== 'DECLINED' &&
      booking.status !== 'DECLINED'
  )

  const accepted = bookings.filter(
    (booking) =>
      booking.providerStatus === 'ACCEPTED' &&
      booking.status !== 'COMPLETED'
  )

  const completed = bookings.filter(
    (booking) =>
      booking.status === 'COMPLETED'
  )

  const todayString = new Date().toISOString().split('T')[0]

  const todayBookings = bookings.filter(
    (booking) =>
      booking.providerStatus === 'ACCEPTED' &&
      booking.status !== 'DECLINED' &&
      String(booking.date || '').startsWith(todayString)
  )

  const declined = bookings.filter(
    (booking) =>
      booking.providerStatus === 'DECLINED'
  )

  const current =
    tab === 'New Requests'
      ? pending
      : tab === 'Accepted' ||
        tab === 'Upcoming'
      ? accepted
      : tab === 'Completed'
      ? completed
      : declined

  const confirmedEarnings =
    bookings
      .filter(
        (booking) =>
          (booking.status === 'CONFIRMED' &&
            booking.providerStatus ===
              'ACCEPTED') ||
          booking.status === 'COMPLETED'
      )
      .reduce(
        (sum, booking) =>
          sum +
          Number(
            booking.amount ??
            booking.total ??
            0
          ),
        0
      )

  const pendingEarnings =
    pending.reduce(
      (sum, booking) =>
        sum +
          Number(
            booking.amount ??
            booking.total ??
            0
          ),
      0
    )

  const flash = (message) => {
    setNotice(message)

    setTimeout(() => {
      setNotice('')
    }, 3000)
  }

  const accept = async (booking) => {
    const bookingId = booking?.bookingId

    if (!bookingId) {
      flash('Booking ID missing')
      return
    }

    try {
      if (backendConnected) {
        await updateBackendBooking(bookingId, {
          status: 'CONFIRMED',
          providerStatus: 'ACCEPTED'
        })
      }

      updateBooking(bookingId, {
        status: 'CONFIRMED',
        providerStatus: 'ACCEPTED'
      })

      setBookings((current) =>
        current.map((item) =>
          item.bookingId === bookingId
            ? {
                ...item,
                status: 'CONFIRMED',
                providerStatus: 'ACCEPTED'
              }
            : item
        )
      )

      flash(
        backendConnected
          ? 'Booking Accepted — Backend Updated'
          : 'Booking Accepted — Local Mode'
      )
    } catch (error) {
      console.error('Backend accept error:', error)
      flash('Booking accept failed')
    }
  }

  const decline = async (booking) => {
    if (
      !window.confirm(
        'Are you sure you want to decline this booking?'
      )
    ) {
      return
    }

    const bookingId = booking?.bookingId

    if (!bookingId) {
      flash('Booking ID missing')
      return
    }

    try {
      if (backendConnected) {
        await updateBackendBooking(bookingId, {
          status: 'DECLINED',
          providerStatus: 'DECLINED'
        })
      }

      updateBooking(bookingId, {
        status: 'DECLINED',
        providerStatus: 'DECLINED'
      })

      setBookings((current) =>
        current.map((item) =>
          item.bookingId === bookingId
            ? {
                ...item,
                status: 'DECLINED',
                providerStatus: 'DECLINED'
              }
            : item
        )
      )

      flash(
        backendConnected
          ? 'Booking Declined — Backend Updated'
          : 'Booking Declined — Local Mode'
      )
    } catch (error) {
      console.error('Backend decline error:', error)
      flash('Booking decline failed')
    }
  }

  const saveExperience = async (form) => {
    try {
      const payload = {
        title: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        duration: form.duration,
        languages: form.languages,
        maxGuests: Number(form.maxGuests),

        city: 'Jaipur',
        location: 'Jaipur, Rajasthan',

        provider: PROVIDER.name,
        providerType: PROVIDER.role,

        rating: 4.5,
        reviewCount: 0,
        trustScore: 88,

        meetingPoint: 'Jaipur',
        image: experiences[0].image
      }

      const response = await fetch(
        `${API_BASE_URL}/api/experiences`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Experience creation failed: ${errorText}`
        )
      }

      const savedExperience = await response.json()

      const item = {
        ...savedExperience,
        tags: [form.category, 'Local'],
        verified: false
      }

      const next = [
        ...providerExperiences,
        item
      ]

      setProviderExperiences(next)

      localStorage.setItem(
        STORE_KEY,
        JSON.stringify(next)
      )

      setAdding(false)

      flash('Experience saved successfully to backend')
    } catch (error) {
      console.error(
        'Create experience backend error:',
        error
      )

      flash(
        'Experience save failed. Please check backend.'
      )
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className="dashboard-topbar">
          <span className="mobile-brand">
            <Link to="/">BYS</Link>
          </span>

          <span>
            Provider workspace · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </span>

          <div>
            <Link
              to="/"
              className="view-public"
            >
              View public profile ↗
            </Link>

            <span className="avatar avatar-small">
              RS
            </span>
          </div>
        </div>

        <main className="dashboard-content provider-content">
          <Profile />

          <div className="provider-alert">
            <span>🔔</span>

            <b>
              {pending.length
                ? `${pending.length} New Booking${
                    pending.length > 1 ? 's' : ''
                  }`
                : 'No new booking requests'}
            </b>

            <small>
              {pending.length
                ? 'Payment confirmed · awaiting your acceptance'
                : 'Complete a tourist booking to see new requests here.'}
            </small>
          </div>

          <div className="provider-metrics">
            <Metric
              label="Today's Bookings"
              value={todayBookings.length}
              detail="Accepted bookings for today"
            />

            <Metric
              label="Upcoming Bookings"
              value={accepted.length}
              detail="Accepted by you"
            />

            <Metric
              label="This Month's Earnings"
              value={formatCurrency(
                confirmedEarnings
              )}
              detail="Direct provider earnings"
              tone="earnings"
            />

            <Metric
              label="Trust Score"
              value={`${PROVIDER.trust}/100`}
              detail="Verification signals complete"
              tone="trust"
            />

            <Metric
              label="Total Experiences"
              value={providerExperiences.length}
              detail="Published locally"
            />

            <Metric
              label="Completed Bookings"
              value={completed.length}
              detail="All-time prototype activity"
            />
          </div>

          <section className="provider-panel requests-panel">
            <div className="provider-panel-heading">
              <div>
                <span className="panel-eyebrow">
                  BOOKING MANAGEMENT
                </span>

                <h2>New Booking Requests</h2>
              </div>

              <span className="provider-count">
                {pending.length} pending
                {' · '}
                {backendConnected
                  ? 'Backend connected'
                  : 'Local mode'}
              </span>
            </div>

            <div className="provider-tabs">
              {[
                'New Requests',
                'Accepted',
                'Upcoming',
                'Completed',
                'Declined'
              ].map((name) => (
                <button
                  className={
                    tab === name ? 'active' : ''
                  }
                  key={name}
                  onClick={() => setTab(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {current.length ? (
              <div className="provider-booking-list">
                {current.map((booking) => (
                  <Request
                    key={booking.bookingId}
                    booking={booking}
                    item={itemFor(booking)}
                    accept={accept}
                    decline={decline}
                    open={setSelected}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title={
                  tab === 'New Requests'
                    ? 'No new booking requests'
                    : `No ${tab.toLowerCase()} bookings`
                }
                copy={
                  tab === 'New Requests'
                    ? 'Complete a tourist booking to see new requests here.'
                    : 'Bookings will appear here as your prototype activity grows.'
                }
              />
            )}
          </section>

          <div className="provider-two-column">
            <section className="provider-panel earnings-panel">
              <div className="provider-panel-heading">
                <div>
                  <span className="panel-eyebrow">
                    EARNINGS
                  </span>

                  <h2>
                    Direct provider earnings
                  </h2>
                </div>

                <Badge tone="gold">
                  ₹0 PLATFORM FEE
                </Badge>
              </div>

              <div className="earnings-total">
                {formatCurrency(
                  confirmedEarnings
                )}

                <small>this month</small>
              </div>

              <div className="earnings-breakdown">
                <div>
                  <span>
                    Completed earnings
                  </span>

                  <strong>
                    {formatCurrency(
                      confirmedEarnings
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Pending earnings
                  </span>

                  <strong>
                    {formatCurrency(
                      pendingEarnings
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Platform fee
                  </span>

                  <strong>₹0</strong>
                </div>
              </div>

              <p>
                Prototype economic model: direct
                provider earnings with no platform fee.
              </p>
            </section>

            <TrustBreakdown />
          </div>

          <ExperienceList
            items={providerExperiences}
            add={() => setAdding(true)}
            voiceAvailability={
              voiceAvailability
            }
            onUpdated={(updated, nextItems) => {
              if (nextItems) {
                setProviderExperiences(nextItems)
                return
              }

              setProviderExperiences((current) =>
                current.map((item) =>
                  item.id === updated.id
                    ? { ...item, ...updated }
                    : item
                )
              )
            }}
          />
        </main>
      </DashboardLayout>

      {selected && (
        <div className="modal-backdrop">
          <div className="modal booking-detail-modal">
            <button
              className="modal-close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <div className="eyebrow">
              🔔 NEW BOOKING RECEIVED
            </div>

            <h2>
              {itemFor(selected)?.title}
            </h2>

            <p>
              {selected.touristName ||
                'Demo Tourist'}{' '}
              · {selected.date} ·{' '}
              {selected.time} ·{' '}
              {selected.guests} guests
            </p>

            <strong>
              {formatCurrency(
                selected.amount
              )}
            </strong>

            <Status tone="blue">
              {selected.paymentStatus ||
                'PAID'}
            </Status>

            <Button
              onClick={() => {
                setSelected(null)
                accept(selected)
              }}
            >
              Accept booking
            </Button>
          </div>
        </div>
      )}

      {adding && (
        <AddExperience
          close={() => setAdding(false)}
          save={saveExperience}
        />
      )}

      {notice && (
        <div className="toast">
          ✦ {notice}

          <button
            onClick={() => setNotice('')}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}