import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/login');
  }

  const name = user?.name || user?.fullName || 'Doctor';

  return (
    <header className="elpis-nav">
      <div className="elpis-nav-inner">
        <Link to="/dashboard" className="elpis-nav-brand">
          Elpis
        </Link>
        <nav className="elpis-nav-links">
          <Link to="/dashboard" className="elpis-nav-link">
            Dashboard
          </Link>
          <Link to="/patients" className="elpis-nav-link">
            Patients
          </Link>
          <Link to="/detection" className="elpis-nav-link">
            Breast Cancer Detection
          </Link>
          <Link to="/profile" className="elpis-nav-link">
            Doctor Profile
          </Link>
          <span className="elpis-nav-badge">Dr. {name}</span>
          <button type="button" className="elpis-btn elpis-btn-secondary elpis-nav-logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
