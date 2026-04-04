import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPatientHistory } from '../api';

function normalizeHistoryPayload(data) {
  if (!data) return { patient: null, visits: [] };
  const patient = data.patient || {
    name: data.name,
    age: data.age,
    gender: data.gender,
    bloodType: data.bloodType,
  };
  const visits = data.visits || data.history || data.records || [];
  return { patient, visits: Array.isArray(visits) ? visits : [] };
}

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await getPatientHistory(id);
      if (cancelled) return;
      if (!res.ok) {
        alert(res.error);
        setPatient(null);
        setVisits([]);
      } else {
        const norm = normalizeHistoryPayload(res.data);
        setPatient(norm.patient);
        setVisits(norm.visits);
      }
      setLoading(false);
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="elpis-page">
      <button
        type="button"
        className="elpis-btn elpis-btn-secondary mb-4"
        onClick={() => navigate('/patients')}
      >
        ← Back to patients
      </button>

      <h1 className="mb-2">Patient history</h1>
      <p className="mb-5 elpis-muted">Medical record overview</p>

      {loading ? (
        <div className="elpis-loading-row">
          <div className="elpis-spinner elpis-spinner-sm" />
          Loading history…
        </div>
      ) : !patient && visits.length === 0 ? (
        <p className="elpis-muted">No data found for this patient.</p>
      ) : (
        <>
          <div className="elpis-card elpis-card-pad mb-6">
            <h2 className="mb-3 text-base font-semibold">Patient information</h2>
            <dl className="elpis-dl-grid">
              <div>
                <dt className="elpis-dl-term">Name</dt>
                <dd className="elpis-dl-desc">{patient?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="elpis-dl-term">Age</dt>
                <dd className="elpis-dl-desc">{patient?.age ?? '—'}</dd>
              </div>
              <div>
                <dt className="elpis-dl-term">Gender</dt>
                <dd className="elpis-dl-desc">{patient?.gender ?? '—'}</dd>
              </div>
              <div>
                <dt className="elpis-dl-term">Blood type</dt>
                <dd className="elpis-dl-desc">{patient?.bloodType ?? '—'}</dd>
              </div>
            </dl>
          </div>

          <h2 className="mb-3 text-base font-semibold">Past visits</h2>
          {visits.length === 0 ? (
            <p className="elpis-muted">No visits recorded.</p>
          ) : (
            <ul className="elpis-visit-list">
              {visits.map((v, idx) => (
                <li key={v.id || idx} className="elpis-visit-card">
                  <p className="mb-1.5 font-semibold text-teal-600">
                    {v.date || v.visitDate || 'Date not set'}
                  </p>
                  <p className="mb-1.5">
                    <strong>Diagnosis:</strong> {v.diagnosis || '—'}
                  </p>
                  <p className="mb-1.5 text-slate-600">
                    <strong>Notes:</strong> {v.notes || '—'}
                  </p>
                  {(v.ultrasoundUrl || v.ultrasoundResults) && (
                    <p className="mt-2 text-sm">
                      <strong>Ultrasound:</strong>{' '}
                      {v.ultrasoundUrl ? (
                        <a href={v.ultrasoundUrl} target="_blank" rel="noreferrer">
                          View results
                        </a>
                      ) : (
                        String(v.ultrasoundResults)
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6">
            <Link to="/patients">Return to patients table</Link>
          </p>
        </>
      )}
    </div>
  );
}
