import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MapPin,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import CarExperience from "../components/CarExperience";
import "./Dashboard.css";

const API = "http://localhost:8080";

function rideValue(ride, keys, fallback = "—") {
  for (const key of keys) {
    const value = ride?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return fallback;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("rideluxUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [accountOpen, setAccountOpen] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [intro, setIntro] = useState(true);

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "My account";

  const userEmail = user?.email || "";

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);

  async function fetchRides(searchRoute = false) {
    setLoading(true);
    setError("");

    try {
      const url =
        searchRoute && source.trim() && destination.trim()
          ? `${API}/api/rides/search?source=${encodeURIComponent(
              source.trim()
            )}&destination=${encodeURIComponent(destination.trim())}`
          : `${API}/api/rides`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to retrieve rides");
      }

      const result = await response.json();

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.content)
        ? result.content
        : Array.isArray(result?.rides)
        ? result.rides
        : [];

      setRides(data);

      if (data.length === 0) {
        setError(
          searchRoute
            ? "No rides found for this route. Try another destination."
            : "There are no rides listed yet. Check back soon."
        );
      }
    } catch {
      setRides([]);
      setError(
        "Couldn't load rides. Please check that the RideLux backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRides();
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    if (!source.trim() || !destination.trim()) {
      setError("Enter both your starting point and destination.");
      return;
    }

    fetchRides(true);
  }

  function swapLocations() {
    setSource(destination);
    setDestination(source);
    setError("");
  }

  function handleLogout() {
    localStorage.removeItem("rideluxUser");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    setUser(null);
    setAccountOpen(false);
    navigate("/login");
  }

  return (
    <main className="lux">
      {intro && (
        <div className="lux-intro">
          <div className="intro-logo">
            <span className="auth-logo">
              <CarFront size={22} />
            </span>
            <span className="intro-wordmark">
              Ride<span>Lux</span>
            </span>
          </div>
          <p>THE SMARTER WAY TO TRAVEL</p>
          <div className="intro-loader">
            <i />
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="lux-header">
        <a
          className="lux-wordmark"
          href="#home"
          aria-label="RideLux home"
        >
          <span className="lux-logo-icon">
            <CarFront size={23} strokeWidth={2.4} />
          </span>
          <span className="wordmark-main">
            Ride<span>Lux</span>
          </span>
        </a>

        <nav className="lux-nav" aria-label="Main navigation">
          <a href="#home" className="lux-nav-current">
            Home
          </a>
          <a href="#find-ride">Find a ride</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>

        <div className="lux-account">
          {user ? (
            <div className="account-menu">
              <button
                type="button"
                className="account-trigger"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((open) => !open)}
              >
                <span className="account-avatar">
                  {String(userName).trim().charAt(0).toUpperCase()}
                </span>

                <span className="account-user-copy">
                  <strong>{userName}</strong>
                  <small>My RideLux</small>
                </span>

                <ChevronDown
                  size={15}
                  className={
                    accountOpen
                      ? "account-chevron is-open"
                      : "account-chevron"
                  }
                />
              </button>

              {accountOpen && (
                <>
                  <button
                    className="account-dismiss"
                    type="button"
                    aria-label="Close account menu"
                    onClick={() => setAccountOpen(false)}
                  />

                  <div className="account-dropdown" role="menu">
                    <div className="account-details">
                      <strong>{userName}</strong>
                      {userEmail && <span>{userEmail}</span>}
                    </div>

                    <Link
                      to="/dashboard"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link className="lux-login-link" to="/login">
                Log in
              </Link>

              <Link className="lux-account-cta" to="/register">
                Get started <MoveUpRight size={15} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* HERO WITH 3D CAR */}
      <section className="lux-hero" id="home">
        <div className="hero-scene">
          <CarExperience />
        </div>

        <div className="hero-glow hero-glow-lime" />
        <div className="hero-glow hero-glow-purple" />
        <div className="hero-shade" />

        <div className="hero-index">
          <span className="hero-eyebrow-icon">
            <Sparkles size={16} />
          </span>
          <span>The smarter way to travel</span>
        </div>

        <div className="hero-content">
          <p className="hero-overline">A BETTER WAY TO GET THERE</p>

          <h1>
            Your journey.
            <br />
            <span>Made</span>
            <br />
            <span>effortless.</span>
          </h1>

          <p className="hero-intro">
            Discover comfortable rides, connect with trusted people and
            travel across cities without the hassle.
          </p>

          <div className="hero-links">
            <a href="#find-ride" className="hero-primary">
              Find your ride <ArrowRight size={19} />
            </a>

            <Link to="/login" className="hero-secondary">
              Offer a ride <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars" aria-label="RideLux community">
              <span>A</span>
              <span>R</span>
              <span>K</span>
              <span>S</span>
            </div>

            <div className="trust-copy">
              <div className="trust-stars" aria-label="5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={15} fill="currentColor" />
                ))}
              </div>
              <span>Built for better journeys</span>
            </div>
          </div>
        </div>

        <div className="hero-floating hero-verified">
          <span className="floating-icon">
            <Check size={19} />
          </span>
          <span>
            <strong>Travel with confidence</strong>
            <small>Every journey matters</small>
          </span>
        </div>

        <div className="hero-floating hero-rating">
          <Star size={18} fill="currentColor" />
          <strong>4.9</strong>
          <span>experience</span>
        </div>

        <div className="hero-route-card">
          <span className="route-card-icon">
            <MapPin size={22} />
          </span>
          <span className="route-card-copy">
            <small>YOUR NEXT ADVENTURE</small>
            <strong>Bengaluru → Mysuru</strong>
          </span>
          <span className="route-card-price">From ₹399</span>
        </div>

        <div className="hero-bottom">
          <span>MADE FOR THE MILES THAT MATTER</span>
          <a href="#find-ride">
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </a>
        </div>
      </section>

      {/* RIDE SEARCH */}
      <section className="lux-search-section" id="find-ride">
        <div className="search-section-top">
          <div className="search-heading">
            <span className="section-number">
              <span>01</span> / YOUR NEXT JOURNEY
            </span>
            <h2>
              Where are
              <br />
              we <em>going?</em>
            </h2>
          </div>

          <p className="search-aside">
            Every great journey starts somewhere.
            <span>Tell us where yours begins.</span>
          </p>
        </div>

        <form className="lux-search-form" onSubmit={handleSearch}>
          <label className="lux-location-field">
            <span className="location-index">A</span>
            <span className="location-input-wrap">
              <span className="location-label">PICK-UP LOCATION</span>
              <span className="location-input-line">
                <MapPin size={17} />
                <input
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                  placeholder="Where from?"
                  aria-label="Starting location"
                />
              </span>
            </span>
          </label>

          <button
            className="lux-swap"
            type="button"
            aria-label="Swap locations"
            onClick={swapLocations}
          >
            <ArrowDown size={18} />
          </button>

          <label className="lux-location-field">
            <span className="location-index location-index-b">B</span>
            <span className="location-input-wrap">
              <span className="location-label">YOUR DESTINATION</span>
              <span className="location-input-line">
                <MapPin size={17} />
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Where to?"
                  aria-label="Destination"
                />
              </span>
            </span>
          </label>

          <button
            className="lux-search-button"
            type="submit"
            disabled={loading}
          >
            <span>{loading ? "Searching..." : "Find a ride"}</span>
            <ArrowUpRight size={19} />
          </button>
        </form>

        {error && (
          <div className="lux-search-message" role="status">
            <span>{error}</span>
            {rides.length === 0 && !loading && (
              <button type="button" onClick={() => fetchRides()}>
                VIEW ALL RIDES <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}

        <div className="search-footnote">
          <span>
            <ShieldCheck size={16} />
            A more comfortable way to travel
          </span>
          <span>LESS ROUTINE. MORE JOURNEY.</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lux-how-section" id="how-it-works">
        <div className="how-heading">
          <span className="section-number">
            <span>02</span> / SIMPLE BY DESIGN
          </span>
          <h2>
            Three steps.
            <br />
            <em>One better journey.</em>
          </h2>
        </div>

        <div className="how-grid">
          <article className="how-card">
            <span className="how-number">01</span>
            <div className="how-icon">
              <MapPin size={23} />
            </div>
            <h3>Choose your route</h3>
            <p>
              Enter your starting point and destination to explore rides.
            </p>
            <ArrowUpRight className="how-arrow" size={20} />
          </article>

          <article className="how-card how-card-highlight">
            <span className="how-number">02</span>
            <div className="how-icon">
              <Users size={23} />
            </div>
            <h3>Find your people</h3>
            <p>
              Discover available journeys and find a ride that works for you.
            </p>
            <ArrowUpRight className="how-arrow" size={20} />
          </article>

          <article className="how-card">
            <span className="how-number">03</span>
            <div className="how-icon">
              <CarFront size={24} />
            </div>
            <h3>Enjoy the journey</h3>
            <p>
              Spend less time worrying about travel and more time enjoying it.
            </p>
            <ArrowUpRight className="how-arrow" size={20} />
          </article>
        </div>
      </section>

      {/* AVAILABLE RIDES */}
      <section className="lux-rides-section" id="rides">
        <div className="rides-topline">
          <span className="section-number">
            <span>03</span> / AVAILABLE JOURNEYS
          </span>
          <span className="rides-total">
            {String(rides.length).padStart(2, "0")} RIDES
          </span>
        </div>

        <div className="rides-title-row">
          <h2>
            Find your
            <br />
            kind of <em>road.</em>
          </h2>
          <p>
            Good company. New places.
            <span>And a better way to get there.</span>
          </p>
        </div>

        {loading && (
          <div className="lux-rides-feedback">
            DISCOVERING AVAILABLE RIDES <span>···</span>
          </div>
        )}

        {!loading && rides.length === 0 && (
          <div className="lux-empty">
            <span className="empty-index">R / 000</span>
            <div>
              <h3>The next journey is waiting to be listed.</h3>
              <p>{error || "New rides will appear here."}</p>
            </div>
            <button type="button" onClick={() => fetchRides()}>
              REFRESH <ArrowUpRight size={15} />
            </button>
          </div>
        )}

        {rides.length > 0 && (
          <div className="lux-ride-list">
            {rides.map((ride, index) => (
              <article
                className="lux-ride"
                key={
                  ride.id ??
                  `${ride.source}-${ride.destination}-${index}`
                }
              >
                <div className="lux-ride-number">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>AVAILABLE</span>
                </div>

                <div className="lux-ride-route">
                  <div className="lux-ride-stop">
                    <span>FROM</span>
                    <strong>
                      {rideValue(
                        ride,
                        ["source", "from", "origin"],
                        "Starting point"
                      )}
                    </strong>
                  </div>

                  <div className="lux-ride-connector">
                    <i />
                  </div>

                  <div className="lux-ride-stop">
                    <span>DESTINATION</span>
                    <strong>
                      {rideValue(
                        ride,
                        ["destination", "to", "dropLocation"],
                        "Destination"
                      )}
                    </strong>
                  </div>
                </div>

                <div className="lux-ride-meta">
                  <span>
                    <CalendarDays size={15} />
                    {rideValue(
                      ride,
                      ["departureTime", "departureDateTime", "time"],
                      "Flexible timing"
                    )}
                  </span>

                  <span>
                    <Users size={15} />
                    {rideValue(
                      ride,
                      ["availableSeats", "seatsAvailable", "seats"],
                      "—"
                    )}{" "}
                    seats available
                  </span>
                </div>

                <div className="lux-ride-price">
                  <span>PER SEAT</span>
                  <strong>
                    ₹
                    {rideValue(
                      ride,
                      ["pricePerSeat", "price", "fare"],
                      "—"
                    )}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}

        <a href="#find-ride" className="rides-search-again">
          SEARCH ANOTHER ROUTE <ArrowRight size={17} />
        </a>
      </section>

      {/* ABOUT RIDELUX */}
      <section className="lux-philosophy" id="about">
        <div className="philosophy-backdrop">R</div>

        <div className="philosophy-main">
          <span className="section-number">
            <span>04</span> / THE RIDELUX IDEA
          </span>

          <h2>
            It's not just
            <br />
            about <em>arriving.</em>
          </h2>

          <p>
            It's the conversations along the way. The places you didn't plan
            to stop. The feeling of getting there together.
          </p>

          <a href="#find-ride">
            START YOUR JOURNEY <ArrowRight size={17} />
          </a>
        </div>

        <div className="philosophy-aside">
          <div className="philosophy-badge">
            <Sparkles size={17} />
            THE RIDELUX DIFFERENCE
          </div>

          <span className="philosophy-quote-mark">“</span>

          <p>
            The journey deserves as much thought as the destination.
          </p>

          <span className="philosophy-signature">THE RIDELUX IDEA</span>

          <div className="philosophy-stats">
            <div>
              <strong>01</strong>
              <span>ONE SHARED ROAD</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>NEW POSSIBILITIES</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lux-footer">
        <a className="footer-wordmark" href="#home">
          <span className="footer-logo">
            <CarFront size={20} />
          </span>
          <span>
            Ride<span>Lux</span>
          </span>
        </a>

        <p>MADE FOR THE MILES THAT MATTER.</p>

        <a href="#home">
          BACK TO TOP <ChevronRight size={15} />
        </a>

        <span>© RIDELUX 2026</span>
      </footer>
    </main>
  );
}