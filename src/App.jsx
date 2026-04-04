import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { clearAuthToken, DEMO_TOKEN, DEMO_USER_KEY, getDoctorProfile, getStoredToken } from './api';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorProfile from './pages/DoctorProfile';
import PatientsTable from './pages/PatientsTable';
import PatientHistory from './pages/PatientHistory';
import BreastCancerDetection from './pages/BreastCancerDetection';

function ProtectedLayout({ children, isAuthenticated, user, setIsAuthenticated, setUser }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  function handleLogout() {
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      {children}
    </>
  );
}

function AppRoutes({
  isAuthenticated,
  setIsAuthenticated,
  user,
  setUser,
}) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout
            isAuthenticated={isAuthenticated}
            user={user}
            setIsAuthenticated={setIsAuthenticated}
            setUser={setUser}
          >
            <Dashboard user={user} setUser={setUser} />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout
            isAuthenticated={isAuthenticated}
            user={user}
            setIsAuthenticated={setIsAuthenticated}
            setUser={setUser}
          >
            <DoctorProfile user={user} setUser={setUser} />
          </ProtectedLayout>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedLayout
            isAuthenticated={isAuthenticated}
            user={user}
            setIsAuthenticated={setIsAuthenticated}
            setUser={setUser}
          >
            <PatientsTable />
          </ProtectedLayout>
        }
      />
      <Route
        path="/patients/:id/history"
        element={
          <ProtectedLayout
            isAuthenticated={isAuthenticated}
            user={user}
            setIsAuthenticated={setIsAuthenticated}
            setUser={setUser}
          >
            <PatientHistory />
          </ProtectedLayout>
        }
      />
      <Route
        path="/detection"
        element={
          <ProtectedLayout
            isAuthenticated={isAuthenticated}
            user={user}
            setIsAuthenticated={setIsAuthenticated}
            setUser={setUser}
          >
            <BreastCancerDetection />
          </ProtectedLayout>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const token = getStoredToken();
      if (!token) {
        setBootstrapping(false);
        return;
      }
      // Dummy login session: restore user from localStorage, skip API
      if (token === DEMO_TOKEN) {
        let demoUser = null;
        try {
          const raw = localStorage.getItem(DEMO_USER_KEY);
          demoUser = raw ? JSON.parse(raw) : null;
        } catch {
          demoUser = null;
        }
        if (cancelled) return;
        setUser(
          demoUser || {
            id: 'demo-1',
            name: 'Demo Doctor',
            email: 'demo@elpis.local',
            specialty: 'General Practice',
            hospital: 'Elpis Demo Hospital',
          }
        );
        setIsAuthenticated(true);
        setBootstrapping(false);
        return;
      }
      const res = await getDoctorProfile();
      if (cancelled) return;
      if (res.ok && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        clearAuthToken();
        setIsAuthenticated(false);
        setUser(null);
      }
      setBootstrapping(false);
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  if (bootstrapping) {
    return (
      <div className="elpis-center-screen">
        <div className="elpis-spinner" />
        <p className="elpis-muted">Loading…</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        user={user}
        setUser={setUser}
      />
    </BrowserRouter>
  );
}
