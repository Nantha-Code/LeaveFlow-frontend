import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Demo credentials
  const demoCredentials = {
    employee: {
      email: 'employee@123.com',
      password: 'Test@123',
    },
    manager: {
      email: 'manager@123.com',
      password: 'Manager@123',
    },
  };

  // Click demo button to auto-fill credentials
  const fillDemoCredentials = (role) => {
    const credentials = demoCredentials[role];

    if (!credentials || isSubmitting) return;

    setEmail(credentials.email);
    setPassword(credentials.password);
    setShowPassword(false);
    setErrorMessage('');
  };

  // Handle login
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        'https://leaveflow-backend-emz2.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          'Unable to process the server response. Please try again.'
        );
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response from the server.');
      }

      if (
        data.user.role !== 'employee' &&
        data.user.role !== 'manager'
      ) {
        throw new Error('Invalid user role.');
      }

      // Store login data
      const storage = rememberMe ? localStorage : sessionStorage;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'employee') {
        navigate('/');
      } else {
        navigate('/overview');
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-badge-row">
            <div className="brand-logo-box">
              <svg
                className="brand-logo-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M4.5 12.75l6 6 9-13.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="brand-title">LeaveFlow</span>
          </div>

          <h1 className="login-heading">Sign in to LeaveFlow</h1>

          <p className="login-subtitle">
            Enter your credentials to access your leave portal
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="login-error" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Sign In Form */}
        <form className="login-form" onSubmit={handleFormSubmit}>
          {/* Email */}
          <div className="form-field">
            <label className="field-label" htmlFor="workEmail">
              Work Email
            </label>

            <div className="input-container">
              <div className="input-icon-wrap">
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                >
                  mail
                </span>
              </div>

              <input
                autoComplete="username"
                className="form-input"
                id="workEmail"
                name="email"
                placeholder="Enter your email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-field">
            <div className="password-label-row">
              <label className="field-label" htmlFor="password">
                Password
              </label>

              <button
                className="forgot-link"
                type="button"
                onClick={() =>
                  setErrorMessage(
                    'Please contact your administrator to reset your password.'
                  )
                }
                disabled={isSubmitting}
              >
                Forgot password?
              </button>
            </div>

            <div className="input-container">
              <div className="input-icon-wrap">
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                >
                  lock
                </span>
              </div>

              <input
                autoComplete="current-password"
                className="form-input password-field"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />

              <button
                className="btn-toggle-password"
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                disabled={isSubmitting}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="checkbox-row">
            <input
              className="form-checkbox"
              id="rememberMe"
              name="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />

            <label className="checkbox-label" htmlFor="rememberMe">
              Remember this device
            </label>
          </div>

          {/* Sign In Button */}
          <div className="signin-button-wrapper">
            <button
              className="btn-primary-signin"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin arrow-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>

                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>

                  <svg
                    className="arrow-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials - Below Sign In Button */}
        <div className="demo-credentials">
          <div className="demo-buttons">
            {/* Employee Demo */}
            <button
              type="button"
              className="demo-account-btn"
              onClick={() => fillDemoCredentials('employee')}
              disabled={isSubmitting}
              aria-label="Fill Employee Demo Login credentials"
            >
              <span
                className="material-symbols-outlined demo-role-icon"
                aria-hidden="true"
              >
                person
              </span>

              <span className="demo-account-info">
                <span className="demo-account-title">
                  Employee Demo Login
                </span>

                <span className="demo-account-email">
                  employee@123.com
                </span>
              </span>

              <span
                className="material-symbols-outlined demo-fill-icon"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </button>

            {/* Manager Demo */}
            <button
              type="button"
              className="demo-account-btn"
              onClick={() => fillDemoCredentials('manager')}
              disabled={isSubmitting}
              aria-label="Fill Manager Demo Login credentials"
            >
              <span
                className="material-symbols-outlined demo-role-icon"
                aria-hidden="true"
              >
                admin_panel_settings
              </span>

              <span className="demo-account-info">
                <span className="demo-account-title">
                  Manager Demo Login
                </span>

                <span className="demo-account-email">
                  manager@123.com
                </span>
              </span>

              <span
                className="material-symbols-outlined demo-fill-icon"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
