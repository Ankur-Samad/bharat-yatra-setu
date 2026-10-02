import React, { useState } from "react";

const providers = [
  {
    id: "PROV-001",
    name: "Ravi Sharma",
    city: "Jaipur, Rajasthan",
    category: "Local Heritage Guide",
    trust: 96,
    status: "Verified",
    bookings: 128,
    earnings: "₹20,350",
    signals: {
      identity: "30/30",
      experience: "18/20",
      documents: "20/20",
      reviews: "14/15",
      reliability: "9/10",
      completeness: "5/5",
    },
  },
  {
    id: "PROV-002",
    name: "Priya Sharma",
    city: "Jaipur, Rajasthan",
    category: "Culture & Food Guide",
    trust: 91,
    status: "Verified",
    bookings: 86,
    earnings: "₹15,600",
    signals: {
      identity: "30/30",
      experience: "18/20",
      documents: "18/20",
      reviews: "13/15",
      reliability: "8/10",
      completeness: "4/5",
    },
  },
  {
    id: "PROV-003",
    name: "Arjun Meena",
    city: "Jodhpur, Rajasthan",
    category: "Heritage Walk Host",
    trust: 78,
    status: "Needs Review",
    bookings: 42,
    earnings: "₹7,800",
    signals: {
      identity: "28/30",
      experience: "15/20",
      documents: "14/20",
      reviews: "11/15",
      reliability: "7/10",
      completeness: "3/5",
    },
  },
];

function Signal({ label, value }) {
  const score = parseInt(value.split("/")[0], 10);
  const total = parseInt(value.split("/")[1], 10);
  const percent = (score / total) * 100;

  return (
    <div className="admin-signal">
      <div className="admin-signal-top">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="admin-signal-track">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [selected, setSelected] = useState(providers[0]);
  const [status, setStatus] = useState(selected.status);

  const approveProvider = () => {
    setStatus("Verified");
    setSelected((prev) => ({ ...prev, status: "Verified" }));
  };

  const reviewProvider = () => {
    setStatus("Needs Review");
    setSelected((prev) => ({ ...prev, status: "Needs Review" }));
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          ✦ <span>BHARAT YATRA <b>SETU</b></span>
        </div>

        <div className="admin-label">ADMIN CONSOLE</div>

        <nav>
          <a className="active">Overview</a>
          <a>Providers</a>
          <a>Verification</a>
          <a>Bookings</a>
          <a>Analytics</a>
        </nav>

        <div className="admin-sidebar-bottom">
          <span>Trust & Verification</span>
          <small>Prototype control centre</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">TRUST OPERATIONS · 01 / 05</p>
            <h1>
              The network is only as strong
              <em> as its trust.</em>
            </h1>
            <p className="admin-subtitle">
              Review provider signals, monitor bookings and keep local
              experiences trustworthy.
            </p>
          </div>

          <div className="admin-header-badge">
            <span>PROTOTYPE</span>
            Simulated verification
          </div>
        </header>

        <section className="admin-stats">
          <div>
            <span>Verified Providers</span>
            <strong>42</strong>
            <small>Across 8 cities</small>
          </div>

          <div>
            <span>Needs Review</span>
            <strong>6</strong>
            <small>Requires admin attention</small>
          </div>

          <div>
            <span>Bookings</span>
            <strong>1,284</strong>
            <small>All-time prototype activity</small>
          </div>

          <div>
            <span>Direct Provider Earnings</span>
            <strong>₹8.4L</strong>
            <small>Platform fee ₹0</small>
          </div>
        </section>

        <section className="admin-content">
          <div className="provider-list-card">
            <div className="card-heading">
              <div>
                <p className="admin-eyebrow">PROVIDER NETWORK</p>
                <h2>Verification queue</h2>
              </div>
              <span>{providers.length} providers</span>
            </div>

            <div className="provider-list">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  className={`provider-row ${
                    selected.id === provider.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelected(provider);
                    setStatus(provider.status);
                  }}
                >
                  <div className="provider-avatar">
                    {provider.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </div>

                  <div className="provider-info">
                    <strong>{provider.name}</strong>
                    <span>{provider.category}</span>
                    <small>{provider.city}</small>
                  </div>

                  <div className="provider-trust">
                    <strong>{provider.trust}</strong>
                    <small>/100</small>
                  </div>

                  <span
                    className={`provider-status ${
                      provider.status === "Verified" ? "verified" : "review"
                    }`}
                  >
                    {provider.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="verification-card">
            <div className="verification-top">
              <div>
                <p className="admin-eyebrow">TRUST PROFILE</p>
                <h2>{selected.name}</h2>
                <p>{selected.id} · {selected.city}</p>
              </div>

              <div className="trust-circle">
                <strong>{selected.trust}</strong>
                <span>/100</span>
              </div>
            </div>

            <div className="verification-note">
              <strong>{status}</strong>
              <span>
                Simulated verification signals for prototype demonstration.
              </span>
            </div>

            <div className="signals">
              <Signal label="Identity / Profile" value={selected.signals.identity} />
              <Signal label="Experience Information" value={selected.signals.experience} />
              <Signal label="Documentation Signals" value={selected.signals.documents} />
              <Signal label="Reviews" value={selected.signals.reviews} />
              <Signal label="Booking Reliability" value={selected.signals.reliability} />
              <Signal label="Profile Completeness" value={selected.signals.completeness} />
            </div>

            <div className="provider-meta">
              <div>
                <span>Bookings</span>
                <strong>{selected.bookings}</strong>
              </div>
              <div>
                <span>Provider Earnings</span>
                <strong>{selected.earnings}</strong>
              </div>
              <div>
                <span>Platform Fee</span>
                <strong>₹0</strong>
              </div>
            </div>

            <div className="admin-actions">
              <button className="approve-btn" onClick={approveProvider}>
                ✓ Approve provider
              </button>

              <button className="review-btn" onClick={reviewProvider}>
                Needs review
              </button>
            </div>

            <p className="admin-disclaimer">
              This prototype uses simulated verification signals. Production
              deployment would integrate authorized identity and government
              verification services.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}