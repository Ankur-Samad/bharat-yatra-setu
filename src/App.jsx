import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'

import {
  LandingPage,
  AdminDashboard,
  ProviderDashboard,
  ProviderSimplePage,
  ProviderTrustPage,
  ProviderVoicePage,
} from './pages'

import {
  BookingPage,
  BookingSuccessPage,
  DiscoverPage,
  ExperienceDetailsPage,
  MyBookingsPage,
  PaymentPage,
} from './touristPages'

import { ProviderPage } from './providerPage'
import AuthPage from './AuthPage'

import './App.css'

// =====================================================
// SESSION HELPERS
// =====================================================

function getCurrentUser() {
  try {
    const authenticated = localStorage.getItem('bys-authenticated')
    const savedUser = localStorage.getItem('bys-current-user')

    if (authenticated !== 'true' || !savedUser) {
      return null
    }

    const user = JSON.parse(savedUser)

    if (!user || !user.role) {
      return null
    }

    return user
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

function getRoleHome(role) {
  switch (role) {
    case 'admin':
      return '/admin'

    case 'provider':
      return '/provider/dashboard'

    case 'tourist':
    default:
      return '/explore'
  }
}

// =====================================================
// SESSION TOOLBAR
// =====================================================

function SessionToolbar() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  if (!user) {
    return null
  }

  const logout = () => {
    localStorage.removeItem('bys-current-user')
    localStorage.removeItem('bys-authenticated')

    navigate('/login', { replace: true })
  }

  const roleLabel =
    user.role === 'admin'
      ? 'ADMIN'
      : user.role === 'provider'
        ? 'PROVIDER'
        : 'TOURIST'

  return (
    <div
      style={{
        position: 'fixed',
        top: '18px',
        right: '22px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px 8px 14px',
        background: 'rgba(255, 253, 252, 0.96)',
        border: '1px solid #DED8CC',
        borderRadius: '999px',
        boxShadow: '0 8px 24px rgba(40, 52, 94, 0.12)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '1.15',
          marginRight: '4px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#B89455',
          }}
        >
          {roleLabel}
        </span>

        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#252525',
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.name}
        </span>
      </div>

      <button
        onClick={logout}
        type="button"
        style={{
          border: 'none',
          borderRadius: '999px',
          padding: '9px 14px',
          background: '#28345E',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        Logout
      </button>
    </div>
  )
}

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ allowedRoles, children }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return (
    <>
      <SessionToolbar />
      {children}
    </>
  )
}

// =====================================================
// PLACEHOLDER
// =====================================================

function Placeholder({ title }) {
  return (
    <div className="route-placeholder">
      <a className="brand" href="/">
        <span className="brand-mark">✦</span>

        <span>
          BHARAT YATRA <b>SETU</b>
        </span>
      </a>

      <span className="placeholder-mark">◌</span>

      <div className="eyebrow">PROTOTYPE ROUTE</div>

      <h1>{title}</h1>

      <p>
        This screen is queued for the next product slice.
        The route and navigation are active in the prototype.
      </p>

      <a className="button" href="/explore">
        Return to discovery <span>↗</span>
      </a>
    </div>
  )
}

// =====================================================
// APP ROUTES
// =====================================================

function AppRoutes() {
  return (
    <Routes>

      {/* =================================================
          ROOT
      ================================================= */}

      {/* Website open hote hi Login page */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* =================================================
          AUTH ROUTES
      ================================================= */}

      <Route
        path="/login"
        element={<AuthPage initialMode="login" />}
      />

      <Route
        path="/signup"
        element={<AuthPage initialMode="signup" />}
      />

      <Route
        path="/auth"
        element={<AuthPage initialMode="login" />}
      />

      {/* =================================================
          PROVIDER ONBOARDING
      ================================================= */}

      <Route
        path="/provider/register"
        element={
          <ProviderSimplePage
            eyebrow="PROVIDER ONBOARDING"
            title={
              <>
                Bring your local story to the <em>network.</em>
              </>
            }
          />
        }
      />

      {/* =================================================
          TOURIST ROUTES
      ================================================= */}

      <Route
        path="/explore"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <DiscoverPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/discover"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <DiscoverPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/experience/:id"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <ExperienceDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/:id"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/:id"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking-success/:bookingId"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <BookingSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <Placeholder title="Your saved connections." />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <Placeholder title="Your traveller profile." />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          PROVIDER ROUTES
      ================================================= */}

      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/trust"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderTrustPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/voice"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderVoicePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/experiences"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/bookings"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/availability"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderSimplePage
              eyebrow="AVAILABILITY"
              title={
                <>
                  Keep the door <em>open.</em>
                </>
              }
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/earnings"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderSimplePage
              eyebrow="EARNINGS"
              title={
                <>
                  See what stays <em>local.</em>
                </>
              }
            />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          ADMIN ROUTES
      ================================================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/verification"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard verification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/providers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard verification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/revenue"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/impact"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          FALLBACK
      ================================================= */}

      <Route
        path="*"
        element={
          <Placeholder title="This route is not in the prototype yet." />
        }
      />

    </Routes>
  )
}

// =====================================================
// ROOT APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App