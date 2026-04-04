import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../api';

export default function PatientsTable() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await getPatients();
      if (cancelled) return;
      if (res.ok) setPatients(res.data);
      else {
        alert(res.error);
        setPatients([]);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => (p.name || '').toLowerCase().includes(q));
  }, [patients, search]);

  return (
    <div className="elpis-page">
      <h1 className="mb-2">Patients</h1>
      <p className="mb-4 elpis-muted">Search and manage patient records</p>

      <input
        className="elpis-input mb-5 max-w-xs"
        type="search"
        placeholder="Search by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="elpis-loading-row">
          <div className="elpis-spinner elpis-spinner-sm" />
          Loading patients…
        </div>
      ) : (
        <div className="elpis-card elpis-table-wrap">
          <table className="elpis-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Last visit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-5 elpis-muted">
                    No patients match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.age ?? '—'}</td>
                    <td>{p.gender ?? '—'}</td>
                    <td>{p.lastVisit ?? '—'}</td>
                    <td>
                      <Link
                        to={`/patients/${p.id}/history`}
                        className="elpis-btn elpis-btn-secondary elpis-btn-table no-underline hover:no-underline"
                      >
                        View history
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
