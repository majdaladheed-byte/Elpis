import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPatients, getDoctorProfile } from '../api';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isVisitToday(lastVisit) {
  if (!lastVisit) return false;
  const s = String(lastVisit);
  return s.startsWith(todayISO()) || s.includes(todayISO());
}

export default function Dashboard({ user, setUser }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const name = user?.name || user?.fullName || 'Doctor';

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [patRes, profileRes] = await Promise.all([getPatients(), getDoctorProfile()]);
      if (cancelled) return;
      if (profileRes.ok && profileRes.data) setUser(profileRes.data);
      if (patRes.ok) setPatients(patRes.data);
      else if (!patRes.ok) alert(patRes.error);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  const totalPatients = patients.length;
  const todayAppointments = patients.filter((p) => isVisitToday(p.lastVisit)).length;
  const recentDetections = patients.filter((p) => p.recentDetection || p.lastDetection).length;

  const recentFive = patients.slice(0, 5);

  return (
    <div className="elpis-page">
      <h1 className="mb-1.5">Dashboard</h1>
      <p className="mb-6 elpis-muted">
        Welcome, <strong className="text-slate-900">Dr. {name}</strong>
      </p>

      {loading ? (
        <div className="elpis-loading-row">
          <div className="elpis-spinner elpis-spinner-sm" />
          Loading dashboard…
        </div>
      ) : (
        <>
          <div className="elpis-metric-grid">
            <div className="elpis-metric-card">
              <p className="m-0 text-xs uppercase elpis-muted">Total patients</p>
              <p className="mt-1.5 text-3xl font-bold text-teal-600">{totalPatients}</p>
            </div>
            <div className="elpis-metric-card">
              <p className="m-0 text-xs uppercase elpis-muted">Today&apos;s appointments</p>
              <p className="mt-1.5 text-3xl font-bold text-cyan-600">{todayAppointments}</p>
            </div>
            <div className="elpis-metric-card">
              <p className="m-0 text-xs uppercase elpis-muted">Recent detections</p>
              <p className="mt-1.5 text-3xl font-bold text-cyan-800">{recentDetections}</p>
            </div>
          </div>

          <div className="elpis-section-head">
            <h2 className="elpis-section-title">Recent patients</h2>
            <Link to="/patients" className="elpis-link-btn">
              View all patients
            </Link>
          </div>

          <div className="elpis-card overflow-hidden">
            {recentFive.length === 0 ? (
              <p className="m-0 p-5 elpis-muted">No patients yet.</p>
            ) : (
              <ul className="m-0 list-none p-0">
                {recentFive.map((p) => (
                  <li key={p.id} className="elpis-patient-row">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-sm elpis-muted">
                      {p.lastVisit ? `Last visit: ${p.lastVisit}` : 'No visits recorded'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
