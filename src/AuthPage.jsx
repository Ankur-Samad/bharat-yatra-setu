import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const roles = [
  {
    id: 'tourist',
    icon: '◉',
    title: 'Tourist',
    description:
      'Discover verified local experiences, book trips and manage your journeys.',
  },
  {
    id: 'provider',
    icon: '✦',
    title: 'Provider',
    description:
      'Offer your local experiences, manage bookings and build your trust profile.',
  },
]


const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');

  .auth-page {
    --navy: #18233f;
    --navy-2: #29365f;
    --olive: #68784c;
    --gold: #d2aa64;
    --cream: #f4f0e7;
    --paper: #fffdf9;
    --ink: #182033;
    --muted: #72798a;
    --line: rgba(24,32,51,.11);
    min-height: 100vh;
    padding: 22px;
    display: grid;
    place-items: center;
    color: var(--ink);
    background:
      radial-gradient(circle at 7% 12%, rgba(210,170,100,.18), transparent 23%),
      radial-gradient(circle at 92% 82%, rgba(104,120,76,.13), transparent 26%),
      var(--cream);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  .auth-page *,
  .auth-page *::before,
  .auth-page *::after { box-sizing: border-box; }

  .auth-shell {
    position: relative;
    width: min(1220px, 100%);
    min-height: min(760px, calc(100vh - 44px));
    display: grid;
    grid-template-columns: .92fr 1.08fr;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.72);
    border-radius: 30px;
    background: var(--paper);
    box-shadow: 0 35px 100px rgba(24,32,51,.18);
    isolation: isolate;
  }

  .auth-shell::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 430px;
    height: 430px;
    left: 43%;
    top: -220px;
    border-radius: 50%;
    background: rgba(210,170,100,.08);
    filter: blur(5px);
  }

  .auth-brand-panel {
    position: relative;
    min-height: 100%;
    padding: 38px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    color: #fff;
    background:
      linear-gradient(145deg, rgba(24,35,63,.94), rgba(41,54,95,.96)),
      url('https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85') center/cover;
  }

  .auth-brand-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(9,15,27,.18), rgba(9,15,27,.68)),
      radial-gradient(circle at 70% 22%, rgba(210,170,100,.22), transparent 24%),
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: auto, auto, 42px 42px, 42px 42px;
    pointer-events: none;
  }

  .auth-brand-panel::after {
    content: '';
    position: absolute;
    width: 560px;
    height: 560px;
    right: -310px;
    bottom: -300px;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 50%;
    box-shadow:
      0 0 0 42px rgba(255,255,255,.025),
      0 0 0 84px rgba(255,255,255,.018);
    pointer-events: none;
  }

  .auth-brand,
  .auth-copy,
  .auth-points { position: relative; z-index: 2; }

  .auth-brand {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    text-decoration: none;
    font-size: 11px;
    letter-spacing: .15em;
    font-weight: 900;
  }

  .auth-brand-mark {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(145deg, var(--gold), #9e7134);
    box-shadow: 0 10px 28px rgba(0,0,0,.22);
    transition: transform .35s ease, box-shadow .35s ease;
  }

  .auth-brand:hover .auth-brand-mark {
    transform: rotate(12deg) scale(1.1);
    box-shadow: 0 16px 35px rgba(210,170,100,.3);
  }

  .auth-brand b { color: #d77a5e; }

  .auth-copy { max-width: 530px; margin-top: auto; margin-bottom: auto; }

  .auth-copy .eyebrow {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 20px;
    color: #dfc18b;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .18em;
  }

  .auth-copy .eyebrow::before {
    content: '';
    width: 30px;
    height: 1px;
    background: var(--gold);
  }

  .auth-copy h1 {
    margin: 0;
    max-width: 520px;
    color: #fffdf7;
    font: 500 clamp(46px, 5vw, 72px)/.94 'Playfair Display', Georgia, serif;
    letter-spacing: -.05em;
  }

  .auth-copy h1 em {
    display: inline-block;
    color: #dfbd79;
    font-style: italic;
    transform: translateX(7px);
  }

  .auth-copy p {
    max-width: 470px;
    margin: 25px 0 0;
    color: rgba(255,255,255,.68);
    font-size: 13px;
    line-height: 1.8;
  }

  .auth-points {
    display: grid;
    gap: 10px;
    margin-top: 34px;
  }

  .auth-point {
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 13px 9px 9px;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 999px;
    background: rgba(255,255,255,.055);
    color: rgba(255,255,255,.75);
    font-size: 10px;
    backdrop-filter: blur(10px);
    transition: transform .25s ease, background .25s ease, border-color .25s ease;
  }

  .auth-point:hover {
    transform: translateX(7px);
    background: rgba(255,255,255,.11);
    border-color: rgba(210,170,100,.35);
  }

  .auth-point span {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--gold);
    background: rgba(210,170,100,.12);
  }

  .auth-floating {
    position: absolute;
    z-index: 3;
    right: 25px;
    top: 42%;
    width: 150px;
    padding: 14px;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 17px;
    background: rgba(15,23,42,.66);
    box-shadow: 0 20px 45px rgba(0,0,0,.2);
    backdrop-filter: blur(14px);
    animation: authFloat 4.5s ease-in-out infinite;
  }

  .auth-floating small {
    display: block;
    color: rgba(255,255,255,.5);
    font-size: 7px;
    font-weight: 900;
    letter-spacing: .12em;
  }

  .auth-floating strong {
    display: block;
    margin-top: 4px;
    color: #fff;
    font: 500 30px Georgia, serif;
  }

  .auth-floating span {
    color: #cbd8bb;
    font-size: 8px;
  }

  @keyframes authFloat {
    50% { transform: translateY(-10px) rotate(1deg); }
  }

  .auth-form-panel {
    position: relative;
    padding: clamp(34px, 5vw, 62px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    background:
      radial-gradient(circle at 100% 0%, rgba(210,170,100,.11), transparent 28%),
      #fffdf9;
  }

  .auth-form-panel::before {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    right: -85px;
    bottom: -85px;
    border: 1px solid rgba(104,120,76,.13);
    border-radius: 50%;
    box-shadow: 0 0 0 25px rgba(104,120,76,.025);
    pointer-events: none;
  }

  .auth-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 42px;
  }

  .auth-tabs {
    display: flex;
    gap: 27px;
    border-bottom: 1px solid var(--line);
  }

  .auth-tab {
    position: relative;
    padding: 0 0 12px;
    border: 0;
    background: transparent;
    color: #89909d;
    cursor: pointer;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .08em;
    transition: color .25s ease;
  }

  .auth-tab::after {
    content: '';
    position: absolute;
    left: 0;
    right: 100%;
    bottom: -1px;
    height: 2px;
    background: var(--olive);
    transition: right .3s ease;
  }

  .auth-tab:hover { color: var(--ink); }
  .auth-tab.active { color: var(--ink); }
  .auth-tab.active::after { right: 0; }

  .auth-top > a {
    color: #68748d;
    font-size: 10px;
    font-weight: 800;
    text-decoration: none;
    transition: color .2s ease, transform .2s ease;
  }

  .auth-top > a:hover {
    color: var(--olive);
    transform: translateX(-3px);
  }

  .auth-form-heading { margin-bottom: 28px; }

  .auth-form-heading .eyebrow {
    margin-bottom: 10px;
    color: #ba8350;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .17em;
  }

  .auth-form-heading h2 {
    margin: 0;
    color: var(--ink);
    font: 500 clamp(36px, 4vw, 52px)/.98 'Playfair Display', Georgia, serif;
    letter-spacing: -.045em;
  }

  .auth-form-heading p {
    margin: 10px 0 0;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.6;
  }

  .auth-field {
    position: relative;
    display: block;
    margin-bottom: 17px;
    color: var(--ink);
    font-size: 10px;
    font-weight: 800;
  }

  .auth-field input {
    width: 100%;
    height: 52px;
    margin-top: 8px;
    padding: 0 15px;
    border: 1px solid var(--line);
    border-radius: 13px;
    outline: none;
    background: #f7f5ef;
    color: var(--ink);
    font: 12px 'DM Sans', sans-serif;
    transition: border-color .25s ease, background .25s ease, box-shadow .25s ease, transform .25s ease;
  }

  .auth-field input:hover { background: #fff; border-color: rgba(104,120,76,.3); }

  .auth-field input:focus {
    background: #fff;
    border-color: var(--olive);
    box-shadow: 0 0 0 4px rgba(104,120,76,.09), 0 10px 25px rgba(24,32,51,.06);
    transform: translateY(-1px);
  }

  .role-heading {
    margin: 25px 0 11px;
    color: var(--ink);
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .1em;
  }

  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 18px;
  }

  .role-card {
    position: relative;
    min-height: 125px;
    padding: 16px;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 17px;
    background: #fff;
    text-align: left;
    cursor: pointer;
    transition: transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s ease, box-shadow .3s ease, background .3s ease;
  }

  .role-card::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    right: -48px;
    bottom: -48px;
    border-radius: 50%;
    background: rgba(104,120,76,.08);
    transition: transform .45s ease;
  }

  .role-card:hover {
    transform: translateY(-6px);
    border-color: rgba(104,120,76,.35);
    box-shadow: 0 18px 35px rgba(24,32,51,.10);
  }

  .role-card:hover::before { transform: scale(2.2); }

  .role-card.selected {
    border-color: var(--olive);
    background: linear-gradient(145deg, #f5f6ee, #fff);
    box-shadow: 0 16px 34px rgba(104,120,76,.13), inset 0 0 0 1px rgba(104,120,76,.25);
  }

  .role-card.selected::after {
    content: '✓';
    position: absolute;
    right: 12px;
    top: 12px;
    width: 23px;
    height: 23px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #fff;
    background: var(--olive);
    font-size: 10px;
    font-weight: 900;
  }

  .role-icon {
    position: relative;
    z-index: 2;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    color: var(--gold);
    background: rgba(210,170,100,.12);
    font-size: 14px;
    transition: transform .3s ease;
  }

  .role-card:hover .role-icon { transform: rotate(-8deg) scale(1.1); }

  .role-card strong,
  .role-card small { position: relative; z-index: 2; display: block; }

  .role-card strong {
    margin-top: 10px;
    color: var(--ink);
    font-size: 12px;
  }

  .role-card small {
    max-width: 240px;
    margin-top: 5px;
    color: var(--muted);
    font-size: 8px;
    line-height: 1.45;
  }

  .auth-submit {
    position: relative;
    width: 100%;
    min-height: 53px;
    overflow: hidden;
    border: 0;
    border-radius: 14px;
    background: linear-gradient(100deg, var(--navy), var(--navy-2));
    color: #fff;
    cursor: pointer;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .03em;
    box-shadow: 0 14px 30px rgba(24,35,63,.18);
    transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
  }

  .auth-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-110%);
    background: linear-gradient(100deg, transparent, rgba(255,255,255,.22), transparent);
    transition: transform .55s ease;
  }

  .auth-submit:hover {
    transform: translateY(-3px);
    background: linear-gradient(100deg, var(--oliveDark, #35452a), var(--olive));
    box-shadow: 0 21px 42px rgba(53,69,42,.24);
  }

  .auth-submit:hover::before { transform: translateX(110%); }

  .auth-switch {
    margin-top: 17px;
    text-align: center;
    color: var(--muted);
    font-size: 9px;
  }

  .auth-switch button,
  .admin-access button {
    border: 0;
    background: none;
    color: #b76b4b;
    cursor: pointer;
    font-weight: 900;
    transition: color .2s ease;
  }

  .auth-switch button:hover,
  .admin-access button:hover { color: var(--olive); }

  .admin-access {
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid var(--line);
    text-align: center;
  }

  .admin-access p {
    margin: 0 0 7px;
    color: #9a9faa;
    font-size: 7px;
    font-weight: 900;
    letter-spacing: .15em;
  }

  .admin-access button { font-size: 9px; }

  .auth-error {
    margin: -3px 0 12px;
    padding: 11px 13px;
    border: 1px solid rgba(184,91,63,.18);
    border-radius: 12px;
    background: #fff1eb;
    color: #a74d35;
    font-size: 9px;
  }

  .auth-journey-line {
    position: absolute;
    z-index: 1;
    left: 45px;
    right: 35px;
    bottom: 142px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(210,170,100,.55), rgba(255,255,255,.14), transparent);
    transform: rotate(-8deg);
    transform-origin: left center;
  }

  .auth-journey-line::before,
  .auth-journey-line::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 0 7px rgba(210,170,100,.09), 0 0 22px rgba(210,170,100,.5);
    transform: translateY(-50%);
  }

  .auth-journey-line::before { left: 17%; }
  .auth-journey-line::after { right: 14%; }

  .auth-status {
    position: absolute;
    z-index: 3;
    top: 38px;
    right: 34px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 11px;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 999px;
    background: rgba(255,255,255,.06);
    color: rgba(255,255,255,.72);
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .08em;
    backdrop-filter: blur(12px);
  }

  .auth-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #a9c77b;
    box-shadow: 0 0 0 5px rgba(169,199,123,.1), 0 0 13px rgba(169,199,123,.65);
    animation: authPulse 2.4s ease-in-out infinite;
  }

  @keyframes authPulse {
    50% { transform: scale(1.2); opacity: .7; }
  }

  .auth-mini-stats {
    position: relative;
    z-index: 3;
    display: flex;
    gap: 9px;
    margin-top: 24px;
  }

  .auth-mini-stat {
    min-width: 105px;
    padding: 11px 12px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 13px;
    background: rgba(255,255,255,.045);
    backdrop-filter: blur(10px);
    transition: transform .25s ease, background .25s ease;
  }

  .auth-mini-stat:hover {
    transform: translateY(-4px);
    background: rgba(255,255,255,.09);
  }

  .auth-mini-stat strong {
    display: block;
    color: #fff;
    font: 500 19px 'Playfair Display', Georgia, serif;
  }

  .auth-mini-stat span {
    display: block;
    margin-top: 2px;
    color: rgba(255,255,255,.48);
    font-size: 7px;
    font-weight: 700;
    letter-spacing: .05em;
  }

  .auth-form-panel {
    overflow: hidden;
  }

  .auth-form-panel::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, transparent, rgba(104,120,76,.42), transparent);
    opacity: .65;
  }

  .auth-form-inner {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
  }

  .auth-form-heading h2::after {
    content: '';
    display: block;
    width: 42px;
    height: 2px;
    margin-top: 15px;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--olive), var(--gold));
  }

  .auth-field input::placeholder { color: #a7acb5; }

  .auth-submit:active,
  .role-card:active { transform: translateY(-1px) scale(.99); }

  .auth-security-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 13px;
    color: #9a9faa;
    font-size: 7px;
  }

  .auth-security-note span {
    color: var(--olive);
    font-size: 10px;
  }

  @media (max-width: 900px) {
    .auth-shell { grid-template-columns: 1fr; }
    .auth-brand-panel { min-height: 380px; }
    .auth-floating { display: none; }
  }

  @media (max-width: 620px) {
    .auth-page { padding: 0; }
    .auth-shell { min-height: 100vh; border-radius: 0; border: 0; }
    .auth-brand-panel { min-height: 340px; padding: 26px 22px; }
    .auth-status,
    .auth-journey-line,
    .auth-floating { display: none; }
    .auth-mini-stats { margin-top: 18px; }
    .auth-points { display: none; }
    .auth-form-panel { padding: 30px 20px; }
  }

  @media (max-width: 430px) {
    .role-grid { grid-template-columns: 1fr; }
    .auth-copy h1 { font-size: 43px; }
    .auth-top { margin-bottom: 30px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .auth-page *, .auth-page *::before, .auth-page *::after {
      animation-duration: .01ms !important;
      transition-duration: .01ms !important;
    }
  }
`

export function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate()

  const [mode, setMode] = useState(initialMode)
  const [role, setRole] = useState('tourist')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    setError('')

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    const user = {
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role,
    }

    localStorage.setItem('bys-current-user', JSON.stringify(user))
    localStorage.setItem('bys-authenticated', 'true')

    navigate(
      role === 'provider'
        ? '/provider/dashboard'
        : '/explore'
    )
  }

  const adminAccess = () => {
    const user = {
      name: 'Bharat Yatra Setu Admin',
      email: 'admin@bharatyatasetu.in',
      role: 'admin',
    }

    localStorage.setItem('bys-current-user', JSON.stringify(user))
    localStorage.setItem('bys-authenticated', 'true')

    navigate('/admin')
  }

  return (
    <>
      <style>{authStyles}</style>

      <div className="auth-page">
        <div className="auth-shell">

          <section className="auth-brand-panel">
            <div className="auth-status">
              <span className="auth-status-dot" />
              TRUSTED TRAVEL NETWORK
            </div>

            <div className="auth-journey-line" />

            <div className="auth-floating">
              <small>NETWORK TRUST</small>
              <strong>94</strong>
              <span>Verified local connections</span>
            </div>

            <Link className="auth-brand" to="/">
              <span className="auth-brand-mark">✦</span>
              <span>
                BHARAT YATRA <b>SETU</b>
              </span>
            </Link>

            <div className="auth-copy">
              <div className="eyebrow">ONE NETWORK · MANY STORIES</div>

              <h1>
                Travel local.<br />
                <em>Travel trusted.</em>
              </h1>

              <p>
                One account for discovering verified local experiences
                or building your own place in the Bharat Yatra Setu network.
              </p>

              <div className="auth-mini-stats">
                <div className="auth-mini-stat">
                  <strong>50+</strong>
                  <span>LOCAL STORIES</span>
                </div>
                <div className="auth-mini-stat">
                  <strong>24/7</strong>
                  <span>DISCOVERY</span>
                </div>
                <div className="auth-mini-stat">
                  <strong>100%</strong>
                  <span>HUMAN CONNECT</span>
                </div>
              </div>
            </div>

            <div className="auth-points">
              <div className="auth-point">
                <span>✦</span>
                Verified local connections
              </div>

              <div className="auth-point">
                <span>✦</span>
                Transparent trust profiles
              </div>

              <div className="auth-point">
                <span>✦</span>
                Direct local experiences
              </div>
            </div>
          </section>

          <section className="auth-form-panel">
            <div className="auth-form-inner">

            <div className="auth-top">
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('login')
                    setError('')
                  }}
                >
                  LOGIN
                </button>

                <button
                  type="button"
                  className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('signup')
                    setError('')
                  }}
                >
                  SIGN UP
                </button>
              </div>

              <Link to="/">← Home</Link>
            </div>

            <div className="auth-form-heading">
              <div className="eyebrow">
                {mode === 'login' ? 'WELCOME BACK' : 'JOIN THE NETWORK'}
              </div>

              <h2>
                {mode === 'login'
                  ? 'Continue your journey.'
                  : 'Create your account.'}
              </h2>

              <p>
                {mode === 'login'
                  ? 'Choose how you use Bharat Yatra Setu.'
                  : 'Choose your role to get started.'}
              </p>
            </div>

            <form onSubmit={submit}>

              {mode === 'signup' && (
                <label className="auth-field">
                  Full name

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                  />
                </label>
              )}

              <label className="auth-field">
                Email address

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="auth-field">
                Password

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </label>

              <div className="role-heading">
                {mode === 'login'
                  ? 'CONTINUE AS'
                  : 'I WANT TO JOIN AS'}
              </div>

              <div className="role-grid">
                {roles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`role-card ${
                      role === item.id ? 'selected' : ''
                    }`}
                    onClick={() => setRole(item.id)}
                  >
                    <span className="role-icon">{item.icon}</span>

                    <strong>{item.title}</strong>

                    <small>{item.description}</small>
                  </button>
                ))}
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button className="auth-submit" type="submit">
                {mode === 'login'
                  ? `Continue as ${
                      role === 'tourist' ? 'Tourist' : 'Provider'
                    } ↗`
                  : `Create ${
                      role === 'tourist' ? 'Tourist' : 'Provider'
                    } account ↗`}
              </button>

            </form>

            <div className="auth-switch">
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}

              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError('')
                }}
              >
                {mode === 'login' ? ' Sign up' : ' Login'}
              </button>
            </div>

            <div className="auth-security-note">
              <span>✦</span>
              Your journey starts with a trusted connection.
            </div>

            <div className="admin-access">
              <p>PLATFORM OPERATIONS</p>

              <button
                type="button"
                onClick={adminAccess}
              >
                Admin access ↗
              </button>
            </div>

            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default AuthPage
