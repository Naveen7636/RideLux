import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "../api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "PASSENGER",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        "/users/register",
        {
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
        }
      );

      console.log(
        "Registration successful:",
        response.data
      );

      setMessage(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the backend. Please check whether Spring Boot is running."
        );
      } else {
        setError(
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          Back to RideLux
        </Link>

        <div className="auth-brand">
          <div className="auth-logo">
            <CarFront size={21} />
          </div>

          <span>
            Ride<span>Lux</span>
          </span>
        </div>

        <div className="auth-form-wrapper register-wrapper">
          <div className="auth-heading">
            <div className="auth-eyebrow">
              <Sparkles size={14} />
              Start your journey
            </div>

            <h1>Create your RideLux account.</h1>

            <p>
              Join thousands of riders and drivers
              travelling smarter every day.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="register-name">
                  Full name
                </label>

                <div className="input-wrapper">
                  <User size={18} />

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-phone">
                  Phone
                </label>

                <div className="input-wrapper">
                  <Phone size={18} />

                  <input
                    id="register-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-email">
                Email address
              </label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="register-password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Account type</label>

              <div className="role-selector">
                <button
                  type="button"
                  className={
                    formData.role === "PASSENGER"
                      ? "role-option active"
                      : "role-option"
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      role: "PASSENGER",
                    }))
                  }
                >
                  Passenger
                </button>

                <button
                  type="button"
                  className={
                    formData.role === "DRIVER"
                      ? "role-option active"
                      : "role-option"
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      role: "DRIVER",
                    }))
                  }
                >
                  Driver
                </button>
              </div>
            </div>

            <div className="terms-row">
              <input
                type="checkbox"
                id="terms"
                required
              />

              <label htmlFor="terms">
                I agree to the RideLux{" "}
                <a href="#terms">Terms of Service</a>{" "}
                and{" "}
                <a href="#privacy">Privacy Policy</a>.
              </label>
            </div>

            {error && (
              <div
                className="auth-message error"
                role="alert"
              >
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div
                className="auth-message success"
                role="status"
              >
                <CheckCircle2 size={17} />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="demo-login">
            <ShieldCheck size={18} />

            <div>
              <strong>
                Your information stays protected
              </strong>

              <span>
                RideLux uses secure authentication to
                protect your account.
              </span>
            </div>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
              <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-visual register-visual">
        <div className="auth-visual-overlay" />

        <img
          src="https://images.unsplash.com/photo-1511994477422-b69e44bd4ea9?auto=format&fit=crop&w=1400&q=85"
          alt="Road trip adventure"
        />

        <div className="auth-quote">
          <div className="quote-stars">
            <span>★★★★★</span>
            <small>Trusted by 10,000+ riders</small>
          </div>

          <h2>
            Don't just
            <br />
            reach places.
          </h2>

          <p>
            Meet people, discover new routes and turn
            ordinary travel into memorable journeys.
          </p>
        </div>

        <div className="auth-floating-card">
          <div className="mini-route-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>RideLux community</span>
            <strong>Verified &amp; trusted</strong>
          </div>

          <b>4.9★</b>
        </div>
      </div>
    </div>
  );
}

export default Register;