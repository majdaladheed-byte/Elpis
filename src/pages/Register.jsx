import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SPECIALTIES = [
  { value: '', label: 'Select specialty' },
  { value: 'general', label: 'General Practice' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'gynecology', label: 'Gynecology' },
  { value: 'internal', label: 'Internal Medicine' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    hospital: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!emailRegex.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    if (!form.specialty) next.specialty = 'Choose a specialty';
    if (!form.hospital.trim()) next.hospital = 'Hospital name is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const userData = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        specialty: form.specialty,
        hospital: form.hospital.trim(),
      };
      const res = await register(userData);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      alert('Registration successful. Please sign in.');
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="elpis-page elpis-page-narrow-md">
      <div className="elpis-auth-card-register">
        <h1 className="elpis-heading-tight">Create account</h1>
        <p className="elpis-stack-loose elpis-muted">Register as a healthcare provider</p>
        <form onSubmit={handleSubmit}>
          <div className="elpis-stack">
            <label className="elpis-label" htmlFor="reg-name">
              Full name
            </label>
            <input
              id="reg-name"
              className="elpis-input"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            {errors.name && <p className="elpis-error">{errors.name}</p>}
          </div>
          <div className="elpis-stack">
            <label className="elpis-label" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              className="elpis-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
            {errors.email && <p className="elpis-error">{errors.email}</p>}
          </div>
          <div className="elpis-stack">
            <label className="elpis-label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              className="elpis-input"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
            />
            {errors.password && <p className="elpis-error">{errors.password}</p>}
          </div>
          <div className="elpis-stack">
            <label className="elpis-label" htmlFor="reg-confirm">
              Confirm password
            </label>
            <input
              id="reg-confirm"
              className="elpis-input"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
            />
            {errors.confirmPassword && <p className="elpis-error">{errors.confirmPassword}</p>}
          </div>
          <div className="elpis-stack">
            <label className="elpis-label" htmlFor="reg-specialty">
              Specialty
            </label>
            <select
              id="reg-specialty"
              className="elpis-input"
              value={form.specialty}
              onChange={(e) => setField('specialty', e.target.value)}
            >
              {SPECIALTIES.map((s) => (
                <option key={s.value || 'empty'} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.specialty && <p className="elpis-error">{errors.specialty}</p>}
          </div>
          <div className="elpis-stack">
            <label className="elpis-label" htmlFor="reg-hospital">
              Hospital name
            </label>
            <input
              id="reg-hospital"
              className="elpis-input"
              value={form.hospital}
              onChange={(e) => setField('hospital', e.target.value)}
            />
            {errors.hospital && <p className="elpis-error">{errors.hospital}</p>}
          </div>
          <button type="submit" className="elpis-btn elpis-btn-primary elpis-btn-block" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="elpis-form-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
