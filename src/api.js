import axios from 'axios';

const TOKEN_KEY = 'elpis_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  const data = err?.response?.data;
  if (typeof data === 'string') return data;
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => (typeof item === 'string' ? item : item?.msg || JSON.stringify(item)))
      .join(', ');
  }
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;
  if (typeof err?.message === 'string') return err.message;
  return fallback;
}

export async function login(email, password) {
  try {
    const { data } = await api.post('/login', { email, password });
    const token = data?.token || data?.access_token || data?.accessToken;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err, 'Invalid credentials') };
  }
}

export async function register(userData) {
  try {
    const payload = {
      username: userData?.username || userData?.name,
      email: userData?.email,
      password: userData?.password,
    };
    const { data } = await api.post('/register', payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err, 'Registration failed') };
  }
}

export async function detectCancer(imageFile) {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    const { data } = await api.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err, 'Prediction failed') };
  }
}

export async function getPatients() {
  try {
    const { data } = await api.get('/patients');
    const list = Array.isArray(data) ? data : data?.patients || data?.data || [];
    return { ok: true, data: list };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err, 'Failed to load patients'), data: [] };
  }
}

export async function getPatientHistory(patientId) {
  try {
    const { data } = await api.get(`/patients/${patientId}/history`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err, 'Failed to load history'), data: null };
  }
}

export async function getDoctorProfile() {
  try {
    const { data } = await api.get('/doctor/profile');
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err, 'Failed to load profile'), data: null };
  }
}

export async function updateDoctorProfile(payload) {
  try {
    const { data } = await api.put('/doctor/profile', payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err, 'Failed to update profile') };
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}
