import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { experiences } from './data'
import { interpretQuery, matchesQuery } from './utils/search'
import {
  AiInterpretation,
  Badge,
  Button,
  ExperienceCard,
  FilterBar,
  SectionTitle,
  Status,
  TrustScore,
  YatraSearch
} from './components'
import {
  getExperiences,
  createBooking,
  getBookings as getBackendBookings
} from './api/api'
import {
  calculateTotal,
  clearBookings,
  createBookingId,
  formatCurrency,
  getBookingDraft,
  getBookings,
  saveBooking,
  saveBookingDraft
} from './utils/booking'

const getVoiceAvailability = () => {
  try {
    return JSON.parse(
      localStorage.getItem(
        'bharat-yatra-setu-voice-availability'
      ) || 'null'
    )
  } catch {
    return null
  }
}


async function getBackendExperienceById(id) {
  const data = await getExperiences()

  if (!Array.isArray(data)) {
    return null
  }

  const backendItem = data.find(
    (experience) =>
      String(experience.id) === String(id)
  )

  if (!backendItem) {
    return null
  }

  const localItem = experiences.find(
    (experience) =>
      String(experience.id) === String(backendItem.id)
  )

  return {
    ...localItem,
    ...backendItem,

    image:
      backendItem.image ||
      localItem?.image ||
      '',

    description:
      backendItem.description ||
      localItem?.description ||
      '',

    provider:
      backendItem.provider ||
      localItem?.provider ||
      'Local Provider',

    providerType:
      backendItem.providerType ||
      localItem?.providerType ||
      'Local Host',

    city:
      backendItem.city ||
      localItem?.city ||
      backendItem.location ||
      'Jaipur',

    location:
      backendItem.location ||
      localItem?.location ||
      backendItem.city ||
      'Jaipur',

    category:
      backendItem.category ||
      localItem?.category ||
      'Local Experience',

    tags:
      backendItem.tags ||
      localItem?.tags ||
      [],

    trustScore:
      backendItem.trustScore ??
      localItem?.trustScore ??
      90,

    reviewCount:
      backendItem.reviewCount ??
      localItem?.reviewCount ??
      0,

    languages:
      backendItem.languages ||
      localItem?.languages ||
      'Hindi, English',

    maxGuests:
      backendItem.maxGuests ??
      localItem?.maxGuests ??
      6,

    included:
      backendItem.included ||
      localItem?.included ||
      [],

    meetingPoint:
      backendItem.meetingPoint ||
      localItem?.meetingPoint ||
      backendItem.location ||
      'Jaipur',

    duration:
      backendItem.duration ||
      localItem?.duration ||
      '2 hours',

    rating:
      backendItem.rating ??
      localItem?.rating ??
      4.5,

    price:
      backendItem.price ??
      localItem?.price ??
      0
  }
}

const matchesVoiceExperience = (item, availability) => {
  if (!availability?.experience || !item?.title) {
    return false
  }

  const itemTitle = item.title.toLowerCase()
  const voiceTitle = availability.experience.toLowerCase()

  if (
    itemTitle.includes('amer fort') &&
    voiceTitle.includes('amer fort')
  ) {
    return true
  }

  if (
    itemTitle.includes('city palace') &&
    voiceTitle.includes('city palace')
  ) {
    return true
  }

  if (
    itemTitle.includes('jaipur') &&
    voiceTitle.includes('jaipur')
  ) {
    return true
  }

  return (
    itemTitle.includes(voiceTitle) ||
    voiceTitle.includes(itemTitle)
  )
}

function VoiceAvailability({ item }) {
  const availability = getVoiceAvailability()

  if (!availability || !matchesVoiceExperience(item, availability)) {
    return null
  }

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: '#eef8f0',
        border: '1px solid #c9e7cf',
        fontSize: '13px',
        fontWeight: '600'
      }}
    >
      🎤 {availability.status} · {availability.date} ·{' '}
      {availability.time}
    </div>
  )
}

function TouristHeader() {
  return (
    <header className="product-header">
      <Link className="brand" to="/">
        <span className="brand-mark">✦</span>
        <span>
          BHARAT YATRA <b>SETU</b>
        </span>
      </Link>

      <nav className="product-nav">
        <Link to="/discover">Discover</Link>
        <Link to="/discover?ai=1">AI Search</Link>
        <Link to="/bookings">Bookings</Link>
      </nav>

      <div className="header-right">
        <Link
          className="provider-switch"
          to="/provider/dashboard"
        >
          For providers ↗
        </Link>

        <span className="avatar avatar-small">
          AK
        </span>
      </div>
    </header>
  )
}

export function HomeSearch() {
  const navigate = useNavigate()

  return (
    <YatraSearch
      onSearch={(query) =>
        navigate(
          `/discover?query=${encodeURIComponent(query)}`
        )
      }
    />
  )
}

export function DiscoverPage() {
  const params = new URLSearchParams(
    window.location.search
  )

  const initialQuery = params.get('query') || ''

  const [query, setQuery] =
    useState(initialQuery)

  const [interpretation, setInterpretation] =
    useState(() =>
      interpretQuery(initialQuery)
    )

  const [loading, setLoading] =
    useState(false)

  const [backendLoading, setBackendLoading] =
    useState(true)

  const [backendExperiences, setBackendExperiences] =
    useState([])

  const [saved, setSaved] =
    useState([])

  const [filters, setFilters] =
    useState({
      city: 'All',
      category: 'All',
      budget: '2000',
      duration: 'Any',
      rating: '0',
      sort: 'Recommended'
    })

  const navigate = useNavigate()

  // Load experiences from Spring Boot backend.
  useEffect(() => {
    async function loadExperiences() {
      try {
        const data = await getExperiences()

        if (Array.isArray(data) && data.length > 0) {
          const mergedExperiences = data.map(
            (backendItem) => {
              const localItem =
                experiences.find(
                  (item) =>
                    String(item.id) ===
                    String(backendItem.id)
                )

              return {
                ...localItem,
                ...backendItem,

                image:
                  backendItem.image ||
                  localItem?.image,

                description:
                  backendItem.description ||
                  localItem?.description ||
                  '',

                provider:
                  backendItem.provider ||
                  localItem?.provider ||
                  'Local Provider',

                providerType:
                  backendItem.providerType ||
                  localItem?.providerType ||
                  'Local Host',

                city:
                  backendItem.city ||
                  localItem?.city ||
                  backendItem.location ||
                  'Jaipur',

                location:
                  backendItem.location ||
                  localItem?.location ||
                  backendItem.city ||
                  'Jaipur',

                category:
                  backendItem.category ||
                  localItem?.category ||
                  'Local Experience',

                tags:
                  backendItem.tags ||
                  localItem?.tags ||
                  [],

                trustScore:
                  backendItem.trustScore ??
                  localItem?.trustScore ??
                  90,

                reviewCount:
                  backendItem.reviewCount ??
                  localItem?.reviewCount ??
                  0,

                languages:
                  backendItem.languages ||
                  localItem?.languages ||
                  'Hindi, English',

                maxGuests:
                  backendItem.maxGuests ??
                  localItem?.maxGuests ??
                  6,

                included:
                  backendItem.included ||
                  localItem?.included ||
                  [],

                meetingPoint:
                  backendItem.meetingPoint ||
                  localItem?.meetingPoint ||
                  backendItem.location ||
                  'Jaipur',

                duration:
                  backendItem.duration ||
                  localItem?.duration ||
                  '2 hours',

                rating:
                  backendItem.rating ??
                  localItem?.rating ??
                  4.5,

                price:
                  backendItem.price ??
                  localItem?.price ??
                  0
              }
            }
          )

          setBackendExperiences(
            mergedExperiences
          )
        } else {
          setBackendExperiences(experiences)
        }
      } catch (error) {
        console.error(
          'Backend API Error:',
          error
        )

        // Keep the app usable if backend is unavailable.
        setBackendExperiences(experiences)
      } finally {
        setBackendLoading(false)
      }
    }

    loadExperiences()
  }, [])

  const search = (nextQuery) => {
    setQuery(nextQuery)
    setLoading(true)

    setTimeout(() => {
      setInterpretation(
        interpretQuery(nextQuery)
      )

      setLoading(false)

      navigate(
        `/discover?query=${encodeURIComponent(
          nextQuery
        )}`,
        { replace: true }
      )
    }, 520)
  }

  const filtered = useMemo(() => {
    const sourceExperiences =
      backendExperiences.length > 0
        ? backendExperiences
        : experiences

    const base =
      sourceExperiences.filter(
        (item) => {
          const intentMatch =
            !query ||
            item.title
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            (item.description || '')
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            matchesQuery(
              item,
              interpretation
            )

          const cityMatch =
            filters.city === 'All' ||
            item.city === filters.city

          const categoryMatch =
            filters.category === 'All' ||
            (Array.isArray(item.tags) &&
              item.tags.includes(
                filters.category
              )) ||
            item.category === filters.category

          const budgetMatch =
            item.price <=
            Number(filters.budget)

          const durationMatch =
            filters.duration === 'Any' ||
            Number.parseFloat(
              item.duration
            ) <=
              Number(filters.duration)

          const ratingMatch =
            item.rating >=
            Number(filters.rating)

          return (
            (query ? intentMatch : true) &&
            cityMatch &&
            categoryMatch &&
            budgetMatch &&
            durationMatch &&
            ratingMatch
          )
        }
      )

    return [...base].sort(
      (a, b) =>
        filters.sort ===
        'Price: Low to High'
          ? a.price - b.price
          : filters.sort ===
            'Highest Rated'
          ? b.rating - a.rating
          : filters.sort ===
            'Trust Score'
          ? b.trustScore - a.trustScore
          : b.trustScore - a.trustScore
    )
  }, [
    backendExperiences,
    filters,
    interpretation,
    query
  ])

  const changeFilter = (
    name,
    value
  ) => {
    setFilters((current) => ({
      ...current,
      [name]: value
    }))
  }

  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="explore-content discovery-page">
          <div className="discover-back">
            <Link to="/">
              ← Back home
            </Link>

            <span>
              {backendLoading
                ? 'CONNECTING TO YATRA SERVER · '
                : 'LIVE YATRA DATA · '}
              {filtered.length} MATCHES
            </span>
          </div>

          <SectionTitle
            eyebrow="DISCOVER · YATRA AI"
            title={
              <>
                Experiences{' '}
                <em>
                  chosen for you.
                </em>
              </>
            }
            copy="Matched by Yatra AI based on your preferences. Every result shows who hosts it, what it costs and why it is trusted."
          />

          <div className="discover-search">
            <YatraSearch
              initialValue={query}
              onSearch={search}
            />
          </div>

          {loading ? (
            <div className="loading-state">
              <span>✦</span>

              <h2>
                Yatra AI is finding
                experiences for you...
              </h2>

              <p>
                Comparing destination,
                budget, duration and local
                trust signals.
              </p>
            </div>
          ) : (
            <>
              <AiInterpretation
                query={interpretation.raw}
              />

              <div className="understood-panel">
                <div>
                  <span>✦</span>

                  <b>
                    YATRA AI UNDERSTOOD
                  </b>

                  <small>
                    Connected to Yatra
                    discovery engine
                  </small>
                </div>

                <div>
                  <span>
                    Destination
                  </span>

                  <strong>
                    {interpretation.destination}
                  </strong>
                </div>

                <div>
                  <span>
                    Experience
                  </span>

                  <strong>
                    {interpretation.category}
                  </strong>
                </div>

                <div>
                  <span>Duration</span>

                  <strong>
                    {interpretation.duration}
                  </strong>
                </div>

                <div>
                  <span>Budget</span>

                  <strong>
                    Under ₹
                    {interpretation.maxBudget.toLocaleString(
                      'en-IN'
                    )}
                  </strong>
                </div>

                <button
                  onClick={() =>
                    document
                      .querySelector(
                        '.filter-bar'
                      )
                      ?.scrollIntoView({
                        behavior: 'smooth'
                      })
                  }
                >
                  Edit search
                </button>
              </div>

              <FilterBar
                filters={filters}
                onChange={changeFilter}
                onSort={(sort) =>
                  changeFilter(
                    'sort',
                    sort
                  )
                }
              />

              <div className="results-toolbar">
                <span>
                  <b>
                    {filtered.length}
                  </b>{' '}
                  experiences selected
                  for you
                </span>

                <span className="mock-label">
                  Backend connected
                </span>
              </div>

              {filtered.length ? (
                <div className="product-experience-grid">
                  {filtered.map(
                    (item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          flexDirection:
                            'column'
                        }}
                      >
                        <ExperienceCard
                          item={item}
                          saved={saved.includes(
                            item.id
                          )}
                          onSave={(id) =>
                            setSaved(
                              (current) =>
                                current.includes(
                                  id
                                )
                                  ? current.filter(
                                      (
                                        value
                                      ) =>
                                        value !==
                                        id
                                    )
                                  : [
                                      ...current,
                                      id
                                    ]
                            )
                          }
                          onView={(
                            experience
                          ) =>
                            navigate(
                              `/experience/${experience.id}`
                            )
                          }
                        />

                        <VoiceAvailability
                          item={item}
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <span>◌</span>

                  <h3>
                    Yatra AI couldn't find
                    an exact match.
                  </h3>

                  <p>
                    Try adjusting your
                    budget, destination or
                    duration.
                  </p>

                  <div className="suggestions">
                    <button
                      onClick={() =>
                        search(
                          '2 hour heritage experience in Jaipur under ₹1000'
                        )
                      }
                    >
                      Jaipur heritage under
                      ₹1000
                    </button>

                    <button
                      onClick={() =>
                        search(
                          'local food experience in Jaipur'
                        )
                      }
                    >
                      Local food in Jaipur
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <div className="tourist-bottom-nav">
        <Link
          className="active"
          to="/discover"
        >
          ⌂
          <span>Discover</span>
        </Link>

        <Link to="/discover?ai=1">
          ✦
          <span>Yatra AI</span>
        </Link>

        <Link to="/bookings">
          □
          <span>Bookings</span>
        </Link>

        <Link to="/saved">
          ♡
          <span>Saved</span>
        </Link>
      </div>
    </div>
  )
}

function ProviderCard({ item }) {
  return (
    <div className="detail-provider-card">
      <div className="detail-provider-top">
        <span className="avatar avatar-large">
          {item.provider
            .split(' ')
            .map(
              (name) => name[0]
            )
            .join('')}
        </span>

        <div>
          <span className="card-kicker">
            HOSTED BY
          </span>

          <h3>
            {item.provider}
          </h3>

          <p>
            {item.providerType} ·{' '}
            {item.city}
          </p>
        </div>

        <TrustScore
          score={item.trustScore}
          compact
        />
      </div>

      <div className="provider-verifications">
        <span>
          ✓ Identity verified
        </span>

        <span>
          ✓ Experience verified
        </span>
      </div>

      <p>
        Local provider · Direct booking
      </p>
    </div>
  )
}

export function ExperienceDetailsPage() {
  const { id } = useParams()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [askOpen, setAskOpen] = useState(false)
  const [question, setQuestion] = useState('')

  const navigate = useNavigate()
  const voiceAvailability = getVoiceAvailability()

  useEffect(() => {
    let active = true

    async function loadExperience() {
      try {
        setLoading(true)
        setError('')

        const data = await getExperiences()

        const backendItem = Array.isArray(data)
          ? data.find(
              (experience) =>
                String(experience.id) === String(id)
            )
          : null

        if (!backendItem) {
          if (active) {
            setError('Experience not found')
            setItem(null)
          }
          return
        }

        const localItem = experiences.find(
          (experience) =>
            String(experience.id) === String(backendItem.id)
        )

        const mergedItem = {
          ...localItem,
          ...backendItem,

          image:
            backendItem.image ||
            localItem?.image ||
            '',

          description:
            backendItem.description ||
            localItem?.description ||
            '',

          provider:
            backendItem.provider ||
            localItem?.provider ||
            'Local Provider',

          providerType:
            backendItem.providerType ||
            localItem?.providerType ||
            'Local Host',

          city:
            backendItem.city ||
            localItem?.city ||
            backendItem.location ||
            'Jaipur',

          location:
            backendItem.location ||
            localItem?.location ||
            backendItem.city ||
            'Jaipur',

          category:
            backendItem.category ||
            localItem?.category ||
            'Local Experience',

          tags:
            backendItem.tags ||
            localItem?.tags ||
            [],

          trustScore:
            backendItem.trustScore ??
            localItem?.trustScore ??
            90,

          reviewCount:
            backendItem.reviewCount ??
            localItem?.reviewCount ??
            0,

          languages:
            backendItem.languages ||
            localItem?.languages ||
            'Hindi, English',

          maxGuests:
            backendItem.maxGuests ??
            localItem?.maxGuests ??
            6,

          included:
            backendItem.included ||
            localItem?.included ||
            [],

          meetingPoint:
            backendItem.meetingPoint ||
            localItem?.meetingPoint ||
            backendItem.location ||
            'Jaipur',

          duration:
            backendItem.duration ||
            localItem?.duration ||
            '2 hours',

          rating:
            backendItem.rating ??
            localItem?.rating ??
            4.5,

          price:
            backendItem.price ??
            localItem?.price ??
            0
        }

        if (active) {
          setItem(mergedItem)
        }
      } catch (error) {
        console.error(
          'Experience details API error:',
          error
        )

        if (active) {
          setError(
            'Experience load nahi ho saki. Please make sure Spring Boot backend is running.'
          )
          setItem(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadExperience()

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="tourist-app">
        <div className="tourist-main">
          <TouristHeader />

          <main className="detail-page">
            <div className="loading-state">
              <span>✦</span>

              <h2>
                Loading experience...
              </h2>

              <p>
                Fetching live Yatra data from
                the backend.
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="tourist-app">
        <div className="tourist-main">
          <TouristHeader />

          <main className="booking-page">
            <div className="booking-card empty-booking">
              <span className="placeholder-mark">
                ◌
              </span>

              <div className="eyebrow">
                EXPERIENCE NOT FOUND
              </div>

              <h1>
                {error || 'Experience not found'}
              </h1>

              <p>
                This experience could not be
                loaded from the Yatra backend.
              </p>

              <Button to="/discover">
                Back to Discover
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const isVoiceExperience =
    matchesVoiceExperience(
      item,
      voiceAvailability
    )

  const isProviderAvailable =
    isVoiceExperience &&
    voiceAvailability?.status === 'Available'

  // Availability is shown to the tourist, but it does not block booking.
  // Provider confirmation will happen from the Provider Dashboard.
  const isProviderUnavailable = false

  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="detail-page">
          <Link
            className="detail-back"
            to="/discover"
          >
            ← Back to experiences
          </Link>

          <div className="detail-hero">
            <img
              src={item.image}
              alt={item.title}
            />

            <div className="detail-hero-caption">
              <Badge>
                {(item.category || 'EXPERIENCE').toUpperCase()}
              </Badge>

              <span>
                {item.city} · {item.duration}
              </span>
            </div>
          </div>

          <div className="detail-layout">
            <article className="detail-main">
              <div className="detail-heading">
                <div>
                  <div className="eyebrow">
                    {item.city.toUpperCase()} · LOCAL EXPERIENCE
                  </div>

                  <h1>
                    {item.title}
                  </h1>

                  <p className="detail-location">
                    ⌖ {item.location} · ★ {item.rating} (
                    {item.reviewCount} reviews)
                  </p>

                  {isProviderAvailable && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: '#eef8f0',
                        border: '1px solid #c9e7cf',
                        fontWeight: '600'
                      }}
                    >
                      🟢 Provider available · {voiceAvailability.date} · {voiceAvailability.time}
                    </div>
                  )}

                </div>

                <TrustScore
                  score={item.trustScore}
                />
              </div>

              <p className="detail-description">
                {item.description}
              </p>

              <div className="detail-facts">
                <div>
                  <span>DURATION</span>
                  <b>{item.duration}</b>
                </div>

                <div>
                  <span>LANGUAGES</span>
                  <b>{item.languages}</b>
                </div>

                <div>
                  <span>GROUP SIZE</span>
                  <b>
                    Up to {item.maxGuests} guests
                  </b>
                </div>
              </div>

              <section className="detail-section">
                <h2>
                  What you'll experience
                </h2>

                <p>
                  Move at a human pace through
                  the places that make {item.city}
                  feel lived in. Your local host
                  adds context, conversation and
                  the details that a standard tour
                  often misses.
                </p>

                <div className="included-list">
                  {item.included?.length > 0 ? (
                    item.included.map(
                      (value) => (
                        <span key={value}>
                          ✓ {value}
                        </span>
                      )
                    )
                  ) : (
                    <>
                      <span>✓ Local experience</span>
                      <span>✓ Verified provider</span>
                      <span>✓ Direct booking</span>
                    </>
                  )}
                </div>
              </section>

              <section className="detail-section">
                <h2>
                  Meeting information
                </h2>

                <p>
                  Meet your provider at{' '}
                  <b>{item.meetingPoint}</b>.
                  Exact directions and a direct
                  contact will be shared after
                  your demo booking.
                </p>
              </section>

              <section className="detail-section">
                <h2>
                  Traveller reviews
                </h2>

                <div className="review-quote">
                  “A thoughtful way to see the
                  city. Our host made every stop
                  feel personal.”

                  <small>
                    — Ananya Kapoor · verified traveller
                  </small>
                </div>
              </section>
            </article>

            <aside className="detail-aside">
              <div className="book-panel">
                <span className="eyebrow">
                  DIRECT, TRANSPARENT PRICE
                </span>

                <strong>
                  ₹{item.price}
                  <small>/ person</small>
                </strong>

                <div className="fee-line">
                  <span>Platform fee</span>
                  <b>₹0</b>
                </div>

                <p>
                  Most of your payment goes
                  directly to the local provider.
                </p>

                {isProviderAvailable && (
                  <div
                    style={{
                      marginBottom: '12px',
                      padding: '10px 12px',
                      borderRadius: '9px',
                      background: '#eef8f0',
                      border: '1px solid #c9e7cf',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    🟢 Available {voiceAvailability.date} at {voiceAvailability.time}
                  </div>
                )}


                <Button
                  onClick={() => {
                    if (!isProviderUnavailable) {
                      navigate(`/booking/${item.id}`)
                    }
                  }}
                  variant="primary"
                >
                  Book this experience
                </Button>

                <button
                  className="ask-button"
                  onClick={() =>
                    setAskOpen(
                      (current) => !current
                    )
                  }
                >
                  ✦ Ask Yatra AI
                </button>
              </div>

              <ProviderCard item={item} />

              {askOpen && (
                <div className="ask-panel">
                  <b>
                    YATRA AI · MOCK ASSISTANT
                  </b>

                  <p>
                    {question
                      ? 'Yes. This experience supports up to ' +
                        item.maxGuests +
                        ' guests and lasts ' +
                        item.duration +
                        '. It is suitable for visitors looking for a relaxed ' +
                        item.category.toLowerCase() +
                        ' experience.'
                      : 'Ask whether this experience fits your group, timing or interests.'}
                  </p>

                  <input
                    value={question}
                    onChange={(event) =>
                      setQuestion(
                        event.target.value
                      )
                    }
                    placeholder="Is this suitable for my family?"
                  />
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

function BookingSummary({
  item,
  guests,
  date,
  time
}) {
  return (
    <div className="booking-experience-summary">
      <img
        src={item.image}
        alt={item.title}
      />

      <div>
        <span className="card-kicker">
          EXPERIENCE SUMMARY
        </span>

        <h2>{item.title}</h2>

        <p>
          {item.city} · Hosted by{' '}
          {item.provider}
        </p>

        <div className="summary-meta">
          <span>
            ★ {item.rating}
          </span>

          <span>
            Trust {item.trustScore}/100
          </span>

          <span>
            {item.duration}
          </span>
        </div>

        {date && (
          <small>
            {date} · {time} · {guests}{' '}
            guest
            {guests === 1 ? '' : 's'}
          </small>
        )}
      </div>
    </div>
  )
}

function PriceBreakdown({
  item,
  guests
}) {
  const total = calculateTotal(
    item.price,
    guests
  )

  return (
    <div className="price-breakdown">
      <div>
        <span>
          Experience price
        </span>

        <strong>
          {formatCurrency(total)}
        </strong>
      </div>

      <div>
        <span>
          Platform fee
        </span>

        <strong>₹0</strong>
      </div>

      <div className="price-total">
        <span>Total</span>

        <strong>
          {formatCurrency(total)}
        </strong>
      </div>

      <p>
        ₹0 platform fee. Your payment goes
        directly to the local provider.
      </p>
    </div>
  )
}

function BackendBookingStatus({ bookingId }) {
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookingId) {
      setLoading(false)
      return
    }

    let active = true

    const loadStatus = async () => {
      try {
        const records = await getBackendBookings()

        const record = records.find(
          (item) => item.bookingId === bookingId
        )

        if (active) {
          setBooking(record || null)
          setLoading(false)
        }
      } catch (error) {
        console.error(
          'Booking status error:',
          error
        )

        if (active) {
          setLoading(false)
        }
      }
    }

    loadStatus()

    const interval = setInterval(
      loadStatus,
      5000
    )

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [bookingId])

  if (!bookingId || loading) {
    return null
  }

  const status =
    booking?.status || 'PENDING'

  const providerStatus =
    booking?.providerStatus || 'PENDING'

  let title = 'Booking request sent'
  let message =
    'Your booking is waiting for provider confirmation.'
  let icon = '⏳'

  if (
    status === 'CONFIRMED' &&
    providerStatus === 'ACCEPTED'
  ) {
    title = 'Booking Confirmed'
    message =
      'Your provider has accepted the booking.'
    icon = '✅'
  }

  if (
    status === 'DECLINED' ||
    providerStatus === 'DECLINED'
  ) {
    title = 'Booking Declined'
    message =
      'The provider has declined this booking.'
    icon = '❌'
  }

  return (
    <div
      style={{
        marginTop: '18px',
        padding: '16px',
        borderRadius: '14px',
        border: '1px solid #d9d9d9',
        background: '#fff'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}
      >
        BOOKING STATUS
      </div>

      <div
        style={{
          fontSize: '18px',
          fontWeight: '700'
        }}
      >
        {icon} {title}
      </div>

      <p
        style={{
          margin: '6px 0 0',
          fontSize: '14px'
        }}
      >
        {message}
      </p>

      <small
        style={{
          display: 'block',
          marginTop: '8px',
          opacity: 0.7
        }}
      >
        Booking ID: {bookingId}
      </small>
    </div>
  )
}

export function BookingPage() {
  const { id } = useParams()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const voiceAvailability =
    getVoiceAvailability()

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(1)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let active = true

    async function loadExperience() {
      try {
        setLoading(true)
        setError('')

        const experience =
          await getBackendExperienceById(id)

        if (active) {
          if (experience) {
            setItem(experience)
          } else {
            setError('Experience not found')
            setItem(null)
          }
        }
      } catch (error) {
        console.error(
          'Booking experience API error:',
          error
        )

        if (active) {
          setError(
            'Experience load nahi ho saki. Please make sure Spring Boot backend is running.'
          )
          setItem(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadExperience()

    return () => {
      active = false
    }
  }, [id])

  const isVoiceExperience =
    matchesVoiceExperience(
      item,
      voiceAvailability
    )

  const isProviderAvailable =
    isVoiceExperience &&
    voiceAvailability?.status === 'Available'

  // Availability is shown to the tourist, but it does not block booking.
  // Provider confirmation will happen from the Provider Dashboard.
  const isProviderUnavailable = false

  useEffect(() => {
    if (
      isProviderAvailable &&
      voiceAvailability?.time
    ) {
      setTime(voiceAvailability.time)
    }
  }, [
    isProviderAvailable,
    voiceAvailability?.time
  ])

  if (loading) {
    return (
      <div className="tourist-app">
        <div className="tourist-main">
          <TouristHeader />

          <main className="booking-page">
            <div className="loading-state">
              <span>✦</span>

              <h2>
                Loading booking...
              </h2>

              <p>
                Fetching live experience data.
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="tourist-app">
        <div className="tourist-main">
          <TouristHeader />

          <main className="booking-page">
            <div className="booking-card empty-booking">
              <span className="placeholder-mark">
                ◌
              </span>

              <div className="eyebrow">
                BOOKING NOT FOUND
              </div>

              <h1>
                Experience not found
              </h1>

              <p>
                {error ||
                  'That experience is no longer available.'}
              </p>

              <Button to="/discover">
                Back to Discover
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const valid = Boolean(
    date &&
      time &&
      guests >= 1 &&
      guests <= item.maxGuests
  )

  const submit = async (event) => {
    event.preventDefault()

    setSubmitted(true)

    if (!valid) {
      return
    }

    const draft = {
      experienceId: item.id,
      date,
      time,
      guests,
      total: calculateTotal(
        item.price,
        guests
      )
    }

    saveBookingDraft(draft)

    navigate(`/payment/${item.id}`, {
      state: draft
    })
  }

  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="booking-page booking-layout">
          <Link
            className="detail-back"
            to={`/experience/${item.id}`}
          >
            ← Back to experience
          </Link>

          <div className="booking-columns">
            <BookingSummary
              item={item}
              guests={guests}
              date={date}
              time={time}
            />

            <form
              className="booking-form-card"
              onSubmit={submit}
            >
              <div className="eyebrow">
                BOOK YOUR LOCAL CONNECTION
              </div>

              <h1>
                Complete your booking
              </h1>

              <p className="booking-note">
                Choose a time that works for
                you. This is a frontend
                prototype.
              </p>

              {isProviderAvailable && (
                <div
                  style={{
                    marginBottom: '16px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#eef8f0',
                    border: '1px solid #c9e7cf',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  🎤 Provider confirmed availability
                  <br />
                  📅 {voiceAvailability.date}
                  <br />
                  🕐 {voiceAvailability.time}
                </div>
              )}


              <div className="booking-fields">
                <label>
                  Date

                  <input
                    type="date"
                    value={date}
                    min={
                      new Date()
                        .toISOString()
                        .split('T')[0]
                    }
                    onBlur={() =>
                      setTouched(
                        (current) => ({
                          ...current,
                          date: true
                        })
                      )
                    }
                    onChange={(event) =>
                      setDate(
                        event.target.value
                      )
                    }
                  />

                  {(touched.date ||
                    submitted) &&
                    !date && (
                      <small className="field-error">
                        Choose a date to
                        continue.
                      </small>
                    )}
                </label>

                <label>
                  Time

                  <select
                    value={time}
                    onBlur={() =>
                      setTouched(
                        (current) => ({
                          ...current,
                          time: true
                        })
                      )
                    }
                    onChange={(event) =>
                      setTime(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select a time
                    </option>

                    {isProviderAvailable && (
                      <option
                        value={
                          voiceAvailability.time
                        }
                      >
                        🎤{' '}
                        {
                          voiceAvailability.time
                        }{' '}
                        · Provider Available
                      </option>
                    )}

                    <option>
                      9:00 AM
                    </option>

                    <option>
                      11:30 AM
                    </option>

                    <option>
                      4:00 PM
                    </option>

                    <option>
                      5:30 PM
                    </option>
                  </select>

                  {(touched.time ||
                    submitted) &&
                    !time && (
                      <small className="field-error">
                        Choose a time to
                        continue.
                      </small>
                    )}
                </label>

                <label>
                  Number of guests

                  <div className="guest-stepper">
                    <button
                      type="button"
                      disabled={
                        isProviderUnavailable
                      }
                      onClick={() =>
                        setGuests(
                          (value) =>
                            Math.max(
                              1,
                              value - 1
                            )
                        )
                      }
                    >
                      −
                    </button>

                    <strong>
                      {guests}
                    </strong>

                    <button
                      type="button"
                      disabled={
                        isProviderUnavailable
                      }
                      onClick={() =>
                        setGuests(
                          (value) =>
                            Math.min(
                              item.maxGuests,
                              value + 1
                            )
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <small>
                    Up to {item.maxGuests}{' '}
                    guests
                  </small>
                </label>
              </div>

              <PriceBreakdown
                item={item}
                guests={guests}
              />

              <button
                className="button booking-confirm"
                disabled={!valid}
                type="submit"
              >
                Continue to Payment

                {!isProviderUnavailable && (
                  <span>↗</span>
                )}
              </button>

              {submitted && !valid && (
                <small className="field-error form-error">
                  Complete the required
                  fields to continue.
                </small>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}


function InvalidBooking() {
  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="booking-page">
          <div className="booking-card empty-booking">
            <span className="placeholder-mark">
              ◌
            </span>

            <div className="eyebrow">
              BOOKING NOT FOUND
            </div>

            <h1>
              Experience not found
            </h1>

            <p>
              That experience is no longer
              available in this prototype.
            </p>

            <Button to="/discover">
              Back to Discover
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

export function PaymentPage() {
  const { id } = useParams()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  const draft =
    window.history.state?.usr ||
    getBookingDraft()

  const [upi, setUpi] =
    useState('ankur@upi')

  const [processing, setProcessing] =
    useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function loadExperience() {
      try {
        setLoading(true)

        const experience =
          await getBackendExperienceById(id)

        if (active) {
          setItem(experience)
        }
      } catch (error) {
        console.error(
          'Payment experience API error:',
          error
        )

        if (active) {
          setItem(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadExperience()

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="tourist-app">
        <div className="tourist-main">
          <TouristHeader />

          <main className="booking-page">
            <div className="loading-state">
              <span>✦</span>

              <h2>
                Loading payment...
              </h2>

              <p>
                Preparing your booking.
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!item || !draft) {
    return <InvalidPayment />
  }

  const normalizedUpi = upi.trim()

  const validUpi =
    normalizedUpi.length > 0 &&
    normalizedUpi.includes('@')

  const handleUpiInput = (event) => {
    setUpi(event.currentTarget.value)
  }

  const pay = async () => {
    if (!validUpi || processing) {
      return
    }

    setProcessing(true)

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1400)
      )

      const backendBooking =
        await createBooking({
          experienceId: item.id,
          experienceName: item.title,
          date: draft.date,
          time: draft.time,
          guests: draft.guests,
          total: draft.total
        })

      if (
        !backendBooking?.success ||
        !backendBooking?.bookingId
      ) {
        throw new Error(
          'Backend booking creation failed'
        )
      }

      const bookingId =
        backendBooking.bookingId

      saveBooking({
        bookingId,
        experienceId: item.id,
        touristName: 'Demo Tourist',
        date: draft.date,
        time: draft.time,
        guests: draft.guests,
        amount: draft.total,
        platformFee: 0,
        provider: item.provider,
        status: 'PENDING',
        paymentStatus: 'SUCCESS'
      })

      localStorage.setItem(
        'bharat-yatra-setu-last-booking-id',
        bookingId
      )

      navigate(
        `/booking-success/${bookingId}`,
        {
          state: {
            bookingId,
            experienceId: item.id,
            date: draft.date,
            time: draft.time,
            guests: draft.guests,
            amount: draft.total,
            provider: item.provider
          }
        }
      )
    } catch (error) {
      console.error(
        'Booking creation error:',
        error
      )

      alert(
        'Booking create nahi ho saki. Please make sure Spring Boot backend is running.'
      )

      setProcessing(false)
    }
  }

  const backendBookingId =
    localStorage.getItem(
      'bharat-yatra-setu-last-booking-id'
    )

  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="booking-page payment-page">
          <Link
            className="detail-back"
            to={`/booking/${item.id}`}
          >
            ← Back to booking
          </Link>

          <div className="payment-header">
            <div className="eyebrow">
              SIMULATED PAYMENT
            </div>

            <h1>
              Secure Payment
            </h1>

            <p>
              Demo UPI Payment · No real banking
              service is connected.
            </p>
          </div>

          <div className="payment-layout">
            <div className="booking-card payment-summary-card">
              <BookingSummary
                item={item}
                guests={draft.guests}
                date={draft.date}
                time={draft.time}
              />

              <PriceBreakdown
                item={item}
                guests={draft.guests}
              />

              <BackendBookingStatus
                bookingId={backendBookingId}
              />
            </div>

            <div className="booking-card payment-form">
              <div className="payment-method">
                <span>UPI</span>
                <b>DEMO</b>
              </div>

              <label>
                Enter UPI ID

                <input
                  value={upi}
                  onInput={handleUpiInput}
                  onChange={handleUpiInput}
                  autoComplete="off"
                  placeholder="example@upi"
                  disabled={processing}
                />
              </label>

              <p className="payment-safe">
                This is a simulated payment. No
                real money will move.
              </p>

              <button
                className="button booking-confirm"
                type="button"
                disabled={
                  !validUpi || processing
                }
                onClick={pay}
              >
                {processing
                  ? 'Processing payment...'
                  : `Pay ${formatCurrency(
                      draft.total
                    )}`}{' '}
                {!processing && (
                  <span>↗</span>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


function InvalidPayment() {
  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="booking-page">
          <div className="booking-card empty-booking">
            <span className="placeholder-mark">
              ◌
            </span>

            <div className="eyebrow">
              PAYMENT SESSION NOT FOUND
            </div>

            <h1>
              Your booking details are
              missing.
            </h1>

            <p>
              Return to Discover and start
              the booking flow again.
            </p>

            <Button to="/discover">
              Back to Discover
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
 export function BookingSuccessPage() {
  const { bookingId } = useParams()

  const location =
    window.history.state?.usr

  const booking =
    location ||
    getBookings().find(
      (value) =>
        value.bookingId === bookingId
    )

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadExperience() {
      if (!booking?.experienceId) {
        if (active) {
          setLoading(false)
        }
        return
      }

      try {
        const experience =
          await getBackendExperienceById(
            booking.experienceId
          )

        if (active) {
          setItem(experience)
        }
      } catch (error) {
        console.error(
          'Booking success experience API error:',
          error
        )

        if (active) {
          setItem(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadExperience()

    return () => {
      active = false
    }
  }, [booking?.experienceId])

  const amount =
    booking?.amount ??
    booking?.total

  if (loading) {
    return (
      <div className="tourist-app">
        <div className="tourist-main">
          <TouristHeader />

          <main className="booking-page">
            <div className="loading-state">
              <span>✦</span>

              <h2>
                Loading booking...
              </h2>

              <p>
                Fetching your confirmed
                experience.
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (
    !booking ||
    !item ||
    !amount
  ) {
    return <InvalidPayment />
  }

  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="booking-page success-page">
          <div className="booking-success">
            <span>✓</span>

            <div className="eyebrow">
              PAYMENT SUCCESS · DEMO
            </div>

            <h1>
              Booking Confirmed
            </h1>

            <p>
              Your local experience is
              confirmed. No real payment
              was processed.
            </p>

            <div className="confirmed-details">
              <div>
                <span>
                  BOOKING ID
                </span>

                <strong>
                  {booking.bookingId}
                </strong>
              </div>

              <div>
                <span>
                  EXPERIENCE
                </span>

                <strong>
                  {item.title}
                </strong>
              </div>

              <div>
                <span>
                  PROVIDER
                </span>

                <strong>
                  Hosted by {item.provider}
                </strong>
              </div>

              <div>
                <span>
                  DATE & TIME
                </span>

                <strong>
                  {booking.date} ·{' '}
                  {booking.time}
                </strong>
              </div>

              <div>
                <span>
                  GUESTS
                </span>

                <strong>
                  {booking.guests}{' '}
                  Guest
                  {booking.guests === 1
                    ? ''
                    : 's'}
                </strong>
              </div>

              <div>
                <span>
                  AMOUNT PAID
                </span>

                <strong>
                  {formatCurrency(
                    amount
                  )}
                </strong>
              </div>
            </div>

            <BackendBookingStatus
              bookingId={bookingId}
            />

            <div className="success-actions">
              <Button to="/bookings">
                View My Bookings
              </Button>

              <Button
                variant="outline"
                to="/discover"
              >
                Continue discovering
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


 export function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [backendConnected, setBackendConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadBookings = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/bookings'
        )

        if (!response.ok) {
          throw new Error('Failed to load bookings')
        }

        const data = await response.json()

        if (!active) return

        setBookings(
          Array.isArray(data) ? data : []
        )

        setBackendConnected(true)
      } catch (error) {
        console.error(
          'Booking backend error:',
          error
        )

        // Fallback to local prototype bookings
        if (active) {
          setBookings(getBookings())
          setBackendConnected(false)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadBookings()

    return () => {
      active = false
    }
  }, [])

  const reset = () => {
    clearBookings()
    setBookings([])
  }

  /*
   * Find the matching experience from frontend data.
   *
   * Backend gives:
   * experienceId: 3
   * experienceName: "Jaipur Local Food Experience"
   *
   * Frontend may have different ID formats,
   * so we match by ID OR title.
   */
  const getExperienceForBooking = (record) => {
    const data = record.booking || record

    return (
      experiences.find(
        (experience) =>
          String(experience.id) ===
          String(data.experienceId)
      ) ||
      experiences.find(
        (experience) =>
          experience.title?.toLowerCase() ===
          data.experienceName?.toLowerCase()
      )
    )
  }

  return (
    <div className="tourist-app">
      <div className="tourist-main">
        <TouristHeader />

        <main className="explore-content bookings-page">

          <div className="discover-back">

            <Link to="/discover">
              ← Back to discover
            </Link>

            <button
              className="demo-reset"
              onClick={reset}
            >
              Clear demo bookings
            </button>

          </div>

          <SectionTitle
            eyebrow="YOUR JOURNEYS"
            title={
              <>
                My{' '}
                <em>Bookings.</em>
              </>
            }
            copy={
              backendConnected
                ? 'Your bookings are connected to the Yatra backend.'
                : 'Your confirmed local connections are stored locally for this prototype.'
            }
          />

          {loading ? (
            <div className="empty-state">
              <span>◌</span>

              <h3>
                Loading your bookings...
              </h3>

              <p>
                Connecting to the Yatra backend.
              </p>
            </div>
          ) : bookings.length ? (

            <div className="my-bookings-list">

              {bookings.map((record) => {

                /*
                 * Backend response:
                 *
                 * {
                 *   booking: {...},
                 *   bookingId: "...",
                 *   paymentStatus: "SUCCESS",
                 *   status: "CONFIRMED",
                 *   providerStatus: "ACCEPTED"
                 * }
                 */

                const data =
                  record.booking || record

                const item =
                  getExperienceForBooking(record)

                const title =
                  item?.title ||
                  data.experienceName ||
                  'Local Experience'

                const city =
                  item?.city ||
                  item?.location ||
                  'India'

                const duration =
                  item?.duration ||
                  ''

                const provider =
                  item?.provider ||
                  'Local Provider'

                const image =
                  item?.image ||
                  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'

                const amount =
                  Number(
                    data.total ??
                    record.amount ??
                    0
                  )

                const guests =
                  Number(
                    data.guests ??
                    record.guests ??
                    1
                  )

                const status =
                  record.status ||
                  data.status ||
                  'PENDING'

                const bookingId =
                  record.bookingId ||
                  data.bookingId ||
                  `BYS-${Date.now()}`

                return (

                  <article
                    className="my-booking-card"
                    key={bookingId}
                  >

                    <img
                      src={image}
                      alt={title}
                    />

                    <div>

                      <span className="card-kicker">
                        {city}
                        {duration
                          ? ` · ${duration}`
                          : ''}
                      </span>

                      <h2>
                        {title}
                      </h2>

                      <p>
                        Hosted by {provider}
                      </p>

                      <div className="booking-card-meta">

                        {data.date && (
                          <span>
                            {data.date}
                          </span>
                        )}

                        {data.time && (
                          <span>
                            {data.time}
                          </span>
                        )}

                        <span>
                          {guests}{' '}
                          guest
                          {guests === 1
                            ? ''
                            : 's'}
                        </span>

                      </div>

                    </div>

                    <div className="my-booking-side">

                      <Status
                        tone={
                          status === 'PENDING'
                            ? 'blue'
                            : status === 'DECLINED'
                              ? 'red'
                              : 'green'
                        }
                      >
                        {status}
                      </Status>

                      <b>
                        {record.paymentStatus ===
                        'SUCCESS'
                          ? 'PAID'
                          : 'PAYMENT PENDING'}
                      </b>

                      <strong>
                        {formatCurrency(amount)}
                      </strong>

                      <small>
                        {bookingId}
                      </small>

                    </div>

                  </article>

                )
              })}

            </div>

          ) : (

            <div className="empty-state">

              <span>◌</span>

              <h3>
                No confirmed bookings yet
              </h3>

              <p>
                Choose a local connection
                and complete the demo
                payment flow to see it
                here.
              </p>

              <Button to="/discover">
                Find an experience
              </Button>

            </div>

          )}

        </main>
      </div>
    </div>
  )
}