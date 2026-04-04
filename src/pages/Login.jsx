import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DEMO_TOKEN, DEMO_USER_KEY } from '../api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Dummy login: no API — wait 1s, then save demo session and go to dashboard */
export default function Login({ setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!emailRegex.test(email.trim())) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Dummy auth: any valid form passes after 1 second (no backend)
    setTimeout(() => {
      const trimmed = email.trim();
      const dummyUser = {
        id: 'demo-1',
        name: trimmed.split('@')[0].replace(/[._]/g, ' ') || 'Demo Doctor',
        email: trimmed,
        specialty: 'General Practice',
        hospital: 'Elpis Demo Hospital',
      };
      localStorage.setItem('elpis_token', DEMO_TOKEN);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(dummyUser));
      setUser(dummyUser);
      setIsAuthenticated(true);
      setLoading(false);
      navigate('/dashboard', { replace: true });
    }, 1000);
  }

  return (
    <div className="elpis-page elpis-page-narrow-sm">
      <div className="elpis-auth-card">
        <h1 className="elpis-heading-tight">Welcome back</h1>
        <p className="elpis-stack-loose elpis-muted">Sign in to Elpis (demo — no server required)</p>
        <form onSubmit={handleSubmit}>
          <div className="elpis-stack">
            <label className="elpis-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="elpis-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="elpis-error">{errors.email}</p>}
          </div>
          <div className="elpis-stack-tight">
            <label className="elpis-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="elpis-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="elpis-error">{errors.password}</p>}
          </div>
          <button type="submit" className="elpis-btn elpis-btn-primary elpis-btn-block" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="elpis-form-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
