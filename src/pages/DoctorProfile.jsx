import { useEffect, useState } from 'react';
import { getDoctorProfile, updateDoctorProfile } from '../api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DoctorProfile({ user, setUser }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    specialty: '',
    hospital: '',
    phone: '',
    profilePictureUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await getDoctorProfile();
      if (cancelled) return;
      if (res.ok && res.data) {
        const d = res.data;
        setForm({
          name: d.name || d.fullName || '',
          email: d.email || '',
          specialty: d.specialty || '',
          hospital: d.hospital || d.hospitalName || '',
          phone: d.phone || d.phoneNumber || '',
          profilePictureUrl: d.profilePictureUrl || d.avatarUrl || '',
        });
        setUser(d);
      } else if (!res.ok) {
        alert(res.error);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!emailRegex.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.specialty.trim()) next.specialty = 'Specialty is required';
    if (!form.hospital.trim()) next.hospital = 'Hospital is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        specialty: form.specialty.trim(),
        hospital: form.hospital.trim(),
        phone: form.phone.trim(),
        profilePictureUrl: form.profilePictureUrl.trim() || undefined,
      };
      const res = await updateDoctorProfile(payload);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      const updated = res.data || { ...user, ...payload };
      setUser(updated);
      alert('Profile saved successfully.');
    } catch (err) {
      alert(err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="elpis-page elpis-loading-row">
        <div className="elpis-spinner elpis-spinner-sm" />
        Loading profile…
      </div>
    );
  }

  return (
    <div className="elpis-page elpis-page-narrow-lg">
      <h1 className="mb-2">Doctor profile</h1>
      <p className="mb-5 elpis-muted">Update your professional information</p>

      <form className="elpis-card elpis-card-pad-lg" onSubmit={handleSubmit}>
        <div className="elpis-stack">
          <label className="elpis-label" htmlFor="prof-name">
            Name
          </label>
          <input
            id="prof-name"
            className="elpis-input"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
          />
          {errors.name && <p className="elpis-error">{errors.name}</p>}
        </div>
        <div className="elpis-stack">
          <label className="elpis-label" htmlFor="prof-email">
            Email
          </label>
          <input
            id="prof-email"
            className="elpis-input"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
          />
          {errors.email && <p className="elpis-error">{errors.email}</p>}
        </div>
        <div className="elpis-stack">
          <label className="elpis-label" htmlFor="prof-specialty">
            Specialty
          </label>
          <input
            id="prof-specialty"
            className="elpis-input"
            value={form.specialty}
            onChange={(e) => setField('specialty', e.target.value)}
          />
          {errors.specialty && <p className="elpis-error">{errors.specialty}</p>}
        </div>
        <div className="elpis-stack">
          <label className="elpis-label" htmlFor="prof-hospital">
            Hospital
          </label>
          <input
            id="prof-hospital"
            className="elpis-input"
            value={form.hospital}
            onChange={(e) => setField('hospital', e.target.value)}
          />
          {errors.hospital && <p className="elpis-error">{errors.hospital}</p>}
        </div>
        <div className="elpis-stack">
          <label className="elpis-label" htmlFor="prof-phone">
            Phone number
          </label>
          <input
            id="prof-phone"
            className="elpis-input"
            type="tel"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
          />
        </div>
        <div className="elpis-stack-tight">
          <label className="elpis-label" htmlFor="prof-avatar">
            Profile picture URL (optional)
          </label>
          <input
            id="prof-avatar"
            className="elpis-input"
            type="url"
            placeholder="https://..."
            value={form.profilePictureUrl}
            onChange={(e) => setField('profilePictureUrl', e.target.value)}
          />
        </div>
        <button type="submit" className="elpis-btn elpis-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
