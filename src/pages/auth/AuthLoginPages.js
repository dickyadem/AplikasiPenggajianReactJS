import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { Form, Button, InputGroup } from "react-bootstrap";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";
import { EnvelopeSimple, Lock, Eye, EyeSlash, ArrowRight, Briefcase } from "@phosphor-icons/react";
import "./Auth.css";

const AuthLoginPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, success, error } = useToast();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const validateForm = () => {
    if (!user.email || !user.email.trim()) {
      error("Email harus diisi!");
      return false;
    }
    if (!user.password || user.password.length < 6) {
      error("Password minimal 6 karakter!");
      return false;
    }
    return true;
  };

  const handleAuthServiceLogin = () => {
    if (!validateForm()) return;

    setLoading(true);
    AuthService.login(user)
      .then((response) => {
        if (response.data && response.data.token) {
          AuthService.saveToken(response.data.token);
          success("Login berhasil! Selamat datang.");
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          error("Response tidak valid. Token tidak ditemukan.");
          setLoading(false);
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Login gagal. Periksa kredensial Anda.";
        error(errorMsg);
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAuthServiceLogin();
    }
  };

  return (
    <>
      <div className="login-page">
        {/* Animated background grid */}
        <div className="login-bg">
          <div className="grid-overlay"></div>
          <div className="glow glow-1"></div>
          <div className="glow glow-2"></div>
          <div className="glow glow-3"></div>
          <div className="float-lines">
            <div className="h-line h1"></div>
            <div className="h-line h2"></div>
            <div className="h-line h3"></div>
            <div className="v-line v1"></div>
            <div className="v-line v2"></div>
          </div>
        </div>

        <div className="login-layout">
          {/* Left Panel - Branding */}
          <div className="login-brand-panel">
            <div className="brand-inner">
              <div className="brand-badge">PAYROLL SYSTEM</div>
              <h1 className="brand-headline">
                Kelola Gaji<br />
                <span className="brand-accent">Tanpa Ribet.</span>
              </h1>
              <p className="brand-tagline">
                Sistem penggajian modern untuk perhitungan gaji otomatis,
                laporan pajak, dan slip gaji digital.
              </p>

              <div className="brand-stats">
                <div className="stat-card">
                  <div className="stat-number">100%</div>
                  <div className="stat-text">Akurat</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">24/7</div>
                  <div className="stat-text">Akses</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">1-Click</div>
                  <div className="stat-text">Export</div>
                </div>
              </div>

              <div className="brand-feature-list">
                <div className="brand-feature-item">
                  <span className="feature-dot"></span>
                  Perhitungan PPh 21 & BPJS Otomatis
                </div>
                <div className="brand-feature-item">
                  <span className="feature-dot"></span>
                  Slip Gaji Digital & Export Excel
                </div>
                <div className="brand-feature-item">
                  <span className="feature-dot"></span>
                  Dashboard Analytics Real-time
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="login-form-panel">
            <div className="login-form-wrapper">
              <div className="form-header">
                <div className="form-logo"><Briefcase weight="fill" /></div>
                <h2 className="form-title">Welcome back</h2>
                <p className="form-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
              </div>

              <div className="login-form-fields">
                <div className={`field-group ${focused === 'email' ? 'focused' : ''} ${user.email ? 'has-value' : ''}`}>
                  <label className="field-label">Email</label>
                  <div className="field-input-wrap">
                    <EnvelopeSimple className="field-icon" />
                    <input
                      name="email"
                      onChange={handleInput}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      onKeyDown={handleKeyDown}
                      value={user.email || ""}
                      type="email"
                      placeholder="nama@email.com"
                      className="field-input"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className={`field-group ${focused === 'password' ? 'focused' : ''} ${user.password ? 'has-value' : ''}`}>
                  <label className="field-label">Password</label>
                  <div className="field-input-wrap">
                    <Lock className="field-icon" />
                    <input
                      name="password"
                      onChange={handleInput}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      onKeyDown={handleKeyDown}
                      value={user.password || ""}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="field-input"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="field-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={`login-btn ${loading ? 'loading' : ''}`}
                  onClick={handleAuthServiceLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="btn-loader">
                      <span className="loader-dot"></span>
                      <span className="loader-dot"></span>
                      <span className="loader-dot"></span>
                    </div>
                  ) : (
                    <>
                      Masuk
                      <ArrowRight className="btn-arrow" />
                    </>
                  )}
                </button>

                <p className="login-help">
                  Hubungi admin untuk pendaftaran akun baru
                </p>
              </div>

              <div className="login-footer">
                <p>&copy; 2024 Payroll System. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastWidget
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <LoadingOverlay show={loading} />
    </>
  );
};

export default AuthLoginPage;
