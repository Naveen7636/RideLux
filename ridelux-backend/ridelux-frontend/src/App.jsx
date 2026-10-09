
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function getSavedUser() {
  try {
    const possibleKeys = [
      "user",
      "currentUser",
      "loggedInUser",
      "rideluxUser",
    ];

    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object") {
        return parsed.user || parsed.data || parsed;
      }
    }
  } catch (error) {
    console.warn("Unable to read saved account information.", error);
  }

  return null;
}

function App() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getSavedUser);

  useEffect(() => {
    function refreshUser() {
      setCurrentUser(getSavedUser());
    }

    window.addEventListener("storage", refreshUser);
    window.addEventListener("ridelux-auth-change", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("ridelux-auth-change", refreshUser);
    };
  }, []);

  const userName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.firstName ||
    "My account";

  const userEmail =
    currentUser?.email ||
    currentUser?.emailAddress ||
    "";

  const popularRoutes = [
    {
      from: "Bangalore",
      to: "Mysore",
      price: "₹399",
      time: "3h 00m",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
    },
    {
      from: "Bangalore",
      to: "Chennai",
      price: "₹699",
      time: "6h 30m",
      image:
        "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=900&q=80",
    },
    {
      from: "Bangalore",
      to: "Coorg",
      price: "₹549",
      time: "5h 00m",
      image:
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Verified community",
      text: "Travel with trusted drivers and verified passengers.",
    },
    {
      icon: Zap,
      title: "Instant booking",
      text: "Find a ride, choose your seat and book in seconds.",
    },
    {
      icon: CarFront,
      title: "Better journeys",
      text: "Comfortable rides designed around the way you travel.",
    },
  ];

  function handleLogout() {
    [
      "user",
      "currentUser",
      "loggedInUser",
      "rideluxUser",
      "token",
      "authToken",
      "jwtToken",
    ].forEach((key) => localStorage.removeItem(key));

    setCurrentUser(null);
    setAccountOpen(false);
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-inner">
          <Link className="logo" to="/">
            <span className="logo-mark">
              <CarFront size={19} strokeWidth={2.5} />
            </span>
            <span className="logo-name">
              Ride<span>Lux</span>
            </span>
          </Link>

          <nav className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#rides" onClick={() => setMenuOpen(false)}>
              Find a ride
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>

            <div className="mobile-actions">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="btn btn-dark"
                  onClick={() => setMenuOpen(false)}
                >
                  My dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-dark"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="nav-actions">
            {currentUser ? (
              <div className="account-container">
                <button
                  type="button"
                  className="account-trigger"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                >
                  <span className="account-avatar">
                    {String(userName).charAt(0).toUpperCase()}
                  </span>
                  <span className="account-trigger-copy">
                    <strong>{userName}</strong>
                    <small>My account</small>
                  </span>
                  <ChevronDown size={15} />
                </button>

                {accountOpen && (
                  <div className="account-dropdown">
                    <div className="account-dropdown-header">
                      <span className="account-avatar account-avatar-large">
                        {String(userName).charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong>{userName}</strong>
                        <span>{userEmail || "RideLux member"}</span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setAccountOpen(false)}
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setAccountOpen(false)}
                    >
                      <UserRound size={17} />
                      My profile
                    </Link>

                    <button type="button" onClick={handleLogout}>
                      <LogOut size={17} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-dark">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow">
                <Sparkles size={15} />
                The smarter way to travel
              </div>

              <h1>
                Your journey.
                <br />
                <span>Made effortless.</span>
              </h1>

              <p className="hero-description">
                Discover comfortable rides, connect with trusted people and
                travel across cities without the hassle.
              </p>

              <div className="hero-actions">
                <Link
                  to={currentUser ? "/dashboard" : "/login"}
                  className="btn btn-primary btn-large"
                >
                  Find your ride
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to={currentUser ? "/offer-ride" : "/register"}
                  className="text-button"
                >
                  Offer a ride
                  <ArrowUpRight size={17} />
                </Link>
              </div>

              <div className="hero-trust">
                <div className="avatar-stack">
                  <span className="avatar avatar-one">A</span>
                  <span className="avatar avatar-two">R</span>
                  <span className="avatar avatar-three">K</span>
                  <span className="avatar avatar-four">S</span>
                </div>

                <div>
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={13}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span>Discover a better way to travel</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-card main-visual">
                <img
                  src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85"
                  alt="Scenic road trip"
                />

                <div className="image-overlay" />

                <div className="floating-route-card">
                  <div className="route-icon">
                    <MapPin size={17} />
                  </div>
                  <div className="route-info">
                    <span>Popular route</span>
                    <strong>Bangalore → Mysore</strong>
                  </div>
                  <span className="route-price">₹399</span>
                </div>

                <div className="floating-rating">
                  <Star size={15} fill="currentColor" />
                  <strong>4.9</strong>
                  <span>experience</span>
                </div>
              </div>

              <div className="floating-stat floating-stat-top">
                <div className="stat-icon green">
                  <Check size={16} />
                </div>
                <div>
                  <strong>Travel confidently</strong>
                  <span>Better journeys</span>
                </div>
              </div>

              <div className="floating-stat floating-stat-bottom">
                <div className="stat-icon purple">
                  <Users size={16} />
                </div>
                <div>
                  <strong>Travel together</strong>
                  <span>Share the journey</span>
                </div>
              </div>
            </div>
          </div>

          <div className="search-wrapper">
            <div className="search-heading">
              <div>
                <span>Plan your next journey</span>
                <strong>Where do you want to go?</strong>
              </div>
              <Link to="/dashboard" className="advanced-search">
                Explore rides <ArrowRight size={15} />
              </Link>
            </div>

            <div className="search-form">
              <SearchField
                icon={<MapPin size={19} />}
                label="From"
                value="Bangalore"
              />
              <div className="search-divider" />
              <SearchField
                icon={<MapPin size={19} />}
                label="To"
                value="Mysore"
              />
              <div className="search-divider" />
              <SearchField
                icon={<CalendarDays size={19} />}
                label="Date"
                value="Select date"
              />
              <div className="search-divider" />
              <SearchField
                icon={<Users size={19} />}
                label="Passengers"
                value="1 passenger"
              />

              <Link
                to={currentUser ? "/dashboard" : "/login"}
                className="search-button"
              >
                <Search size={19} />
                Search rides
              </Link>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-inner">
            <Stat value="Flexible" label="Travel options" />
            <Stat value="Simple" label="Ride discovery" />
            <Stat value="Together" label="Better journeys" />
            <Stat value="RideLux" label="Your travel companion" />
          </div>
        </section>

        <section className="section features-section" id="how-it-works">
          <div className="section-heading centered">
            <div className="eyebrow dark">
              <Sparkles size={14} />
              Why RideLux
            </div>

            <h2>
              Travel better.
              <br />
              <span>Travel together.</span>
            </h2>

            <p>
              Everything you need for a smoother journey, from discovering
              rides to reaching your destination.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={21} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <Link to="/dashboard" className="card-link">
                    Explore rides <ArrowUpRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section routes-section" id="rides">
          <div className="section-top">
            <div>
              <div className="eyebrow dark">
                <MapPin size={14} />
                Explore routes
              </div>

              <h2>
                Popular journeys
                <br />
                <span>from your city.</span>
              </h2>
            </div>

            <Link to="/dashboard" className="outline-button">
              Find available rides <ArrowRight size={16} />
            </Link>
          </div>

          <div className="route-grid">
            {popularRoutes.map((route) => (
              <article
                className="route-card"
                key={`${route.from}-${route.to}`}
              >
                <div className="route-image">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    loading="lazy"
                  />
                  <span className="route-badge">Popular route</span>
                </div>

                <div className="route-content">
                  <div className="route-path">
                    <div className="location-dot" />
                    <strong>{route.from}</strong>
                    <span className="route-line" />
                    <div className="location-dot destination" />
                    <strong>{route.to}</strong>
                  </div>

                  <div className="route-meta">
                    <span>
                      <Clock3 size={14} />
                      {route.time}
                    </span>
                    <strong>{route.price}</strong>
                  </div>

                  <Link to="/dashboard" className="route-button">
                    Explore rides <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section" id="about">
          <div className="cta-glow" />

          <div className="cta-content">
            <div className="eyebrow cta-eyebrow">
              <Sparkles size={14} />
              Your next journey starts here
            </div>

            <h2>
              Less planning.
              <br />
              <span>More exploring.</span>
            </h2>

            <p>
              Discover new routes, connect with fellow travellers and enjoy a
              better way to travel.
            </p>

            <div className="cta-actions">
              <Link
                to={currentUser ? "/dashboard" : "/register"}
                className="btn btn-white btn-large"
              >
                Start riding <ArrowRight size={18} />
              </Link>

              <Link
                to={currentUser ? "/offer-ride" : "/register"}
                className="cta-text-button"
              >
                Become a driver <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link className="logo footer-logo" to="/">
              <span className="logo-mark">
                <CarFront size={18} />
              </span>
              <span className="logo-name">
                Ride<span>Lux</span>
              </span>
            </Link>

            <p>
              Modern rides.
              <br />
              Meaningful journeys.
            </p>
          </div>

          <div className="footer-column">
            <strong>Product</strong>
            <Link to="/dashboard">Find a ride</Link>
            <Link to={currentUser ? "/offer-ride" : "/register"}>
              Offer a ride
            </Link>
            <a href="#how-it-works">How it works</a>
          </div>

          <div className="footer-column">
            <strong>Company</strong>
            <a href="#about">About</a>
            <a href="#about">Careers</a>
            <a href="#about">Contact</a>
          </div>

          <div className="footer-column">
            <strong>Account</strong>
            {currentUser ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">My profile</Link>
                <button type="button" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register">Create account</Link>
              </>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 RideLux. All rights reserved.</span>
          <span>Built for better journeys.</span>
        </div>
      </footer>
    </div>
  );
}

function SearchField({ icon, label, value }) {
  return (
    <div className="search-field">
      <span className="search-field-icon">{icon}</span>
      <span className="search-field-content">
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
      <ChevronDown size={15} className="search-chevron" />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat-item">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default App;