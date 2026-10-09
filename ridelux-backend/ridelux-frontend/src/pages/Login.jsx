
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import api from "../api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = response.data;

      if (!user?.role) {
        setError("Login response is missing the user role. Please contact support.");
        return;
      }

      localStorage.setItem("rideluxUser", JSON.stringify(user));

      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the backend. Please check whether Spring Boot is running."
        );
      } else {
        setError(
          "Login failed. Please check your credentials and try again."
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
          <ArrowLeft size={18} />
          Back to home
        </Link>

        <div className="auth-form-wrapper">
          <div className="auth-brand">
            <div className="auth-logo">R</div>
            <span>RideLux</span>
          </div>

          <div className="auth-heading">
            <p className="auth-eyebrow">WELCOME BACK</p>
            <h1>Sign in to RideLux</h1>
            <p>
              Continue your journey with comfortable,
              reliable rides.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>

              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>

              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-message error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-overlay" />
        <div className="auth-quote">
          <span>RIDE BETTER.</span>
          <h2>
            Your journey starts
            <br />
            here.
          </h2>
          <p>
            Book smarter. Travel comfortably.
            Ride with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
