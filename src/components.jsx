import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navItems, provider } from './data'

export function Brand({ dark = false }) { return <Link className={`brand ${dark ? 'brand-dark' : ''}`} to="/"><span className="brand-mark">✦</span><span>BHARAT YATRA <b>SETU</b></span></Link> }
export function Button({ children, to, variant = 'primary', onClick, type = 'button' }) { return to ? <Link className={`button button-${variant}`} to={to}>{children}<span>↗</span></Link> : <button type={type} className={`button button-${variant}`} onClick={onClick}>{children}<span>↗</span></button> }
export function Badge({ children, tone = 'green' }) { return <span className={`badge badge-${tone}`}>{children}</span> }
export function Toast({ message, onClose }) { if (!message) return null; return <div className="toast"><span>✦</span>{message}<button aria-label="Dismiss" onClick={onClose}>×</button></div> }

export function TouristHeader() { return <header className="product-header"><Brand /><nav className="product-nav"><NavLink to="/explore">Discover</NavLink><NavLink to="/explore?ai=1">AI Search</NavLink><NavLink to="/bookings">Bookings</NavLink></nav><div className="header-right"><Link className="provider-switch" to="/provider/dashboard">For providers ↗</Link><span className="avatar avatar-small">AK</span></div></header> }
export function SideNav({ type = 'provider' }) { return <aside className="side-nav"><Brand dark /><div className="side-context"><span className={`context-dot ${type}`} />{type === 'admin' ? 'Trust operations' : 'Provider workspace'}</div><nav>{navItems[type].map((item) => <NavLink key={item.path} to={item.path} end={item.path === `/${type === 'admin' ? 'admin' : 'provider/dashboard'}`}>{item.label}<span>›</span></NavLink>)}</nav><div className="side-help"><span>?</span><b>Need a hand?</b><small>Read the provider guide</small></div><Link className="side-profile" to="/"><img src={provider.image} alt="Rajesh Kumar" /><span>Rajesh Kumar<small>View public profile</small></span><b>···</b></Link></aside> }
export function DashboardLayout({ type = 'provider', children }) { return <div className="dashboard-shell"><SideNav type={type} /><div className="dashboard-main">{children}</div></div> }

export function StatCard({ label, value, change, tone = '' }) { return <div className={`stat-card ${tone}`}><div className="stat-label">{label}<span>↗</span></div><strong>{value}</strong>{change && <small className={change.startsWith('+') ? 'positive' : ''}>{change}</small>}</div> }
export function TrustScore({ score = 94, compact = false }) { return <div className={`trust-score-widget ${compact ? 'compact' : ''}`}><div className="score-ring"><strong>{score}</strong><span>/100</span></div><div><b>TRUST SCORE</b><small>{compact ? 'Verified provider' : 'Based on 5 verified signals'}</small></div></div> }
export function Status({ children, tone = 'green' }) { return <span className={`status status-${tone}`}><i />{children}</span> }
export function SectionTitle({ eyebrow, title, copy, action }) { return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div> }
export function EmptyState({ title, copy, action }) { return <div className="empty-state"><span>◌</span><h3>{title}</h3><p>{copy}</p>{action}</div> }

export function ExperienceCard({ item, onView, saved = false, onSave }) { return <article className="product-experience-card"><div className="product-card-image"><img src={item.image} alt={item.title} /><Badge>✓ VERIFIED</Badge><button className={`heart ${saved ? 'saved' : ''}`} onClick={() => onSave?.(item.id)} aria-label="Save experience">{saved ? '♥' : '♡'}</button></div><div className="product-card-body"><span className="card-kicker">{item.category} · {item.city || item.location}</span><h3>{item.title}</h3><p className="card-description">{item.description}</p><p className="provider-line"><span className="avatar avatar-tiny">{item.provider.split(' ').map((name) => name[0]).join('')}</span> Hosted by <b>{item.provider}</b></p><div className="card-stats"><span>★ {item.rating} <small>({item.reviewCount || 0})</small></span><Badge tone="gold">TRUST {item.trustScore || item.trust}</Badge><span>{item.duration}</span></div><div className="product-card-footer"><strong>₹{item.price}<small>/ person</small></strong><Button onClick={() => onView?.(item)} variant="small">View experience</Button></div></div></article> }

export function AiInterpretation({ phase = 'ready', query = 'I have 2 hours in Jaipur. I want something authentic. Budget ₹1000.' }) { return <div className="ai-interpretation"><div className="ai-panel-top"><span className="ai-spark">✦</span><div><b>YATRA AI</b><small>{phase === 'ready' ? 'Intent to experience' : 'Live recommendation engine'}</small></div><Status tone="green">{phase === 'ready' ? 'Ready' : 'Processing'}</Status></div><div className="user-query">“{query}”</div><div className="interpretation-grid"><div><span>DESTINATION</span><b>Jaipur</b></div><div><span>DURATION</span><b>2 hours</b></div><div><span>BUDGET</span><b>₹1000</b></div><div><span>INTENT</span><b>Authentic heritage</b></div></div><div className="ai-search-pipeline"><span>SEARCHING VERIFIED PROVIDERS</span><strong>12 <small>experiences discovered</small></strong><b>↓</b><strong>7 <small>match budget</small></strong><b>↓</b><strong>5 <small>match duration</small></strong><b>↓</b><strong>3 <small>verified matches</small></strong></div></div> }

export function RecommendationReasons({ item }) { return <div className="recommendation-reasons"><div className="reason-title"><span>✦</span><b>WHY YATRA AI RECOMMENDS THIS</b><Badge tone="gold">BEST MATCH</Badge></div>{item.reason.map((reason) => <div className="reason" key={reason}><span>✓</span>{reason}</div>)}</div> }
export function BookingModal({ item, onClose, onConfirm }) { return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}>×</button><div className="eyebrow">DEMO BOOKING</div><h2>Reserve your local connection.</h2><p>You're booking <b>{item.title}</b> with {item.provider}. This prototype does not process real payments.</p><div className="booking-summary"><span>Experience price</span><strong>₹{item.price}</strong><span>Platform commission</span><strong>₹0</strong><span>Total demo price</span><strong>₹{item.price}</strong></div><Button onClick={onConfirm}>Confirm demo booking</Button></div></div> }

export function VerificationTimeline() { return <div className="verification-timeline"><div className="timeline-head"><div><div className="eyebrow">TRANSPARENT VERIFICATION</div><h2>From documents to trust.</h2></div><Badge tone="amber">SIMULATED VERIFICATION</Badge></div><p className="timeline-note">Production version will integrate authorized government/ASI services.</p><div className="timeline-steps">{['Identity document', 'Guide certificate', 'Supporting document', 'Document analysis', 'Identity match', 'Location check', 'Duplicate check', 'Trust score'].map((step, index) => <div className={`timeline-item ${index < 5 ? 'done' : ''}`} key={step}><span>{index < 5 ? '✓' : `0${index - 2}`}</span><b>{step}</b>{index < 7 && <i>→</i>}</div>)}</div></div> }

export function TrustProfile() { return <div className="trust-profile"><div className="profile-head"><img src={provider.image} alt={provider.name} /><div><span className="card-kicker">{provider.role}</span><h2>{provider.name}</h2><p>⌖ {provider.location}</p></div><TrustScore score={provider.trust} compact /></div><div className="profile-divider" /><h3>Why this provider is trusted</h3><div className="trust-signals"><div><b>✓</b><span>Identity<small>Verified</small></span></div><div><b>✓</b><span>Documents<small>Verified</small></span></div><div><b>✓</b><span>Location<small>Verified</small></span></div></div><div className="profile-metrics"><div><strong>{provider.experience}</strong><span>Experience</span></div><div><strong>{provider.reviews}</strong><span>Reviews</span></div><div><strong>{provider.repeat}</strong><span>Repeat travellers</span></div><div><strong>{provider.response}</strong><span>Response rate</span></div></div></div> }

export function PriceFlow() { return <div className="price-flow"><div className="eyebrow">PROTOTYPE ECONOMIC MODEL</div><h2>More value stays local.</h2><div className="money-node tourist-money"><span>Tourist pays</span><strong>₹800</strong></div><div className="flow-line">↓ <small>direct connection</small></div><div className="money-node provider-money"><span>Local provider receives</span><strong>₹800</strong></div><div className="price-zeroes"><div><span>Platform commission</span><strong>₹0</strong></div><div><span>Hidden charges</span><strong>₹0</strong></div></div><p>Designed so more value stays with the person creating the experience.</p></div> }

export function NetworkGraph() { return <div className="network-graph"><div className="eyebrow">OPEN DISCOVERY ARCHITECTURE</div><h2>One network. Many local voices.</h2><div className="network-map"><div className="network-node tourist-node"><span>◉</span><b>Tourist</b></div><div className="network-connector">↓</div><div className="network-node ai-node"><span>✦</span><b>Yatra AI</b></div><div className="network-connector">↓</div><div className="network-node setu-node"><span>◈</span><b>Bharat Yatra Setu</b></div><div className="provider-nodes"><div>♧<small>Guide</small></div><div>⌂<small>Homestay</small></div><div>◌<small>Local experience</small></div><div>✧<small>Cultural host</small></div></div></div><p>Prototype representation of an open discovery architecture.</p></div> }

export function VoiceAssistant() {
  const [listening, setListening] = useState(false)
  const [text, setText] = useState(
    'Mere paas kal shaam 5 baje Amer Fort tour available hai.'
  )

  const [availability, setAvailability] = useState({
    date: 'Tomorrow',
    time: '5 PM',
    experience: 'Amer Fort Tour',
    status: 'Available'
  })

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported. Please use Google Chrome.')
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      setText(spokenText)

      const lowerText = spokenText.toLowerCase()

      let newDate = 'Tomorrow'
      let newTime = '5 PM'
      let newExperience = 'Amer Fort Tour'
      let newStatus = 'Available'

      if (
        lowerText.includes('aaj') ||
        lowerText.includes('आज') ||
        lowerText.includes('today')
      ) {
        newDate = 'Today'
      }

      if (
        lowerText.includes('kal') ||
        lowerText.includes('कल') ||
        lowerText.includes('tomorrow')
      ) {
        newDate = 'Tomorrow'
      }

      if (
        lowerText.includes('parso') ||
        lowerText.includes('परसों')
      ) {
        newDate = 'Day After Tomorrow'
      }

      const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(baje|बजे|pm|am)?/)

     if (timeMatch) {
  const hour = timeMatch[1]

  if (
    lowerText.includes('shaam') ||
    lowerText.includes('शाम') ||
    lowerText.includes('pm')
  ) {
    newTime = `${hour} PM`
  } else if (
    lowerText.includes('subah') ||
    lowerText.includes('सुबह') ||
    lowerText.includes('am')
  ) {
    newTime = `${hour} AM`
  } else {
    newTime = `${hour}`
  }
}

      if (
        lowerText.includes('city palace') ||
        lowerText.includes('सिटी पैलेस')
      ) {
        newExperience = 'City Palace Tour'
      } else if (
        lowerText.includes('amer fort') ||
        lowerText.includes('आमेर') ||
        lowerText.includes('आमेर किला')
      ) {
        newExperience = 'Amer Fort Tour'
      } else if (
        lowerText.includes('jaipur') ||
        lowerText.includes('जयपुर')
      ) {
        newExperience = 'Jaipur Heritage Tour'
      }

      if (
        lowerText.includes('unavailable') ||
        lowerText.includes('not available') ||
        lowerText.includes('अनअवेलेबल') ||
        lowerText.includes('अनअवेलेबल है') ||
        lowerText.includes('अनअवेलेबल') ||
        lowerText.includes('उपलब्ध नहीं') ||
        lowerText.includes('उपलब्ध नहीं है') ||
        lowerText.includes('बंद') ||
        lowerText.includes('नहीं है') ||
        lowerText.includes('available नहीं')
      ) {
        newStatus = 'Unavailable'
      } else if (
        lowerText.includes('available') ||
        lowerText.includes('उपलब्ध') ||
        lowerText.includes('उपलब्ध है')
      ) {
        newStatus = 'Available'
      }

      setAvailability({
        date: newDate,
        time: newTime,
        experience: newExperience,
        status: newStatus
      })
      localStorage.setItem(
  'bharat-yatra-setu-voice-availability',
  JSON.stringify({
    date: newDate,
    time: newTime,
    experience: newExperience,
    status: newStatus
  })
)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
  }

  return (
    <div className="voice-card">
      <div className="voice-head">
        <div>
          <div className="eyebrow">LOW-DIGITAL-LITERACY ACCESS</div>
          <h2>Speak. We'll keep it updated.</h2>
        </div>

        <Badge tone="amber">SIMULATION</Badge>
      </div>

      <div className="voice-bubble">
        <span className="voice-wave">◖)))</span>

        <p>“{text}”</p>

        <small>
          {listening ? 'LISTENING · Hindi' : 'VOICE CAPTURED · Hindi'}
        </small>
      </div>

      <div className="voice-processing">
        <div>
          <span>01</span>
          <b>UNDERSTANDING</b>

          <p>
            Date: {availability.date}
            <br />
            Time: {availability.time}
            <br />
            Experience: {availability.experience}
            <br />
            Status: {availability.status}
          </p>
        </div>

        <i>↓</i>

        <div>
          <span>02</span>
          <b>LISTING UPDATED</b>

          <p>Traveller availability updated.</p>

          <Status>Success</Status>
        </div>
      </div>

      <Button variant="voice" onClick={startListening}>
        {listening ? 'Listening...' : 'Hold to speak'} <span>◉</span>
      </Button>
    </div>
  )
}
export function YatraSearch({
  initialValue = '',
  onSearch,
  compact = false
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <form
      className={`yatra-search ${compact ? 'compact' : ''}`}
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(value)
      }}
    >
      <span>✦</span>

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Try: 2 hour heritage experience in Jaipur under ₹1000"
        aria-label="Search with Yatra AI"
      />

      <button type="submit">
        Ask Yatra AI ↗
      </button>
    </form>
  )
}
export function FilterBar({ filters, onChange, onSort }) { return <div className="filter-bar"><label>Destination<select value={filters.city} onChange={(event) => onChange('city', event.target.value)}><option value="All">All cities</option>{['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Varanasi', 'Agra', 'Hampi'].map((city) => <option key={city}>{city}</option>)}</select></label><label>Category<select value={filters.category} onChange={(event) => onChange('category', event.target.value)}><option value="All">All categories</option>{['Heritage', 'Food', 'Craft', 'Story'].map((category) => <option key={category}>{category}</option>)}</select></label><label>Budget<select value={filters.budget} onChange={(event) => onChange('budget', event.target.value)}><option value="2000">Any budget</option><option value="800">Under ₹800</option><option value="1000">Under ₹1,000</option><option value="1500">Under ₹1,500</option></select></label><label>Duration<select value={filters.duration} onChange={(event) => onChange('duration', event.target.value)}><option value="Any">Any duration</option><option value="2">Up to 2 hours</option><option value="3">Up to 3 hours</option><option value="4">Up to 4 hours</option></select></label><label>Rating<select value={filters.rating} onChange={(event) => onChange('rating', event.target.value)}><option value="0">Any rating</option><option value="4.7">4.7+</option><option value="4.8">4.8+</option><option value="4.9">4.9</option></select></label><label>Sort<select value={filters.sort} onChange={(event) => onSort(event.target.value)}><option value="Recommended">Recommended</option><option value="Price: Low to High">Price: Low to High</option><option value="Highest Rated">Highest Rated</option><option value="Trust Score">Trust Score</option></select></label></div> }
