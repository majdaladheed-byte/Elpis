import axios from 'axios';
import { getMockPatientHistory, mockPatients } from './mockData';

const TOKEN_KEY = 'elpis_token';
/** Set by dummy login in Login.jsx; App restores session without calling the API */
export const DEMO_USER_KEY = 'elpis_demo_user';
export const DEMO_TOKEN = 'elpis-demo';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(err) {
  const msg =
    err.response?.data?.message ||
    err.response?.data?.error ||
    (typeof err.response?.data === 'string' ? err.response.data : null);
  if (msg) return msg;
  if (err.message) return err.message;
  return 'Something went wrong. Please try again.';
}

/**
 * Mock shapes (backend should return similar JSON):
 * login: { token, user: { id, name, email, specialty, hospital } }
 * getPatients: [ { id, name, age, gender, lastVisit } ]
 * getPatientHistory: { patient: { name, age, gender, bloodType }, visits: [ { date, diagnosis, notes, ultrasoundUrl } ] }
 * detectCancer: { prediction, confidence, riskLevel, recommendations }
 */

export async function login(email, password) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    const token = data.token || data.access_token || data.accessToken;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err) };
  }
}

export async function register(userData) {
  try {
    const { data } = await api.post('/auth/register', userData);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err) };
  }
}

export async function getPatients() {
  if (isDemoSession()) {
    return { ok: true, data: [...mockPatients] };
  }
  try {
    const { data } = await api.get('/patients');
    const list = Array.isArray(data) ? data : data.patients || data.data || [];
    return { ok: true, data: list };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err), data: [] };
  }
}

export async function getPatientHistory(patientId) {
  if (isDemoSession()) {
    const data = getMockPatientHistory(patientId);
    if (data) return { ok: true, data };
    return { ok: false, error: 'Patient not found', data: null };
  }
  try {
    const { data } = await api.get(`/patients/${patientId}/history`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err), data: null };
  }
}

export async function getDoctorProfile() {
  try {
    const { data } = await api.get('/doctor/profile');
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err), data: null };
  }
}

export async function updateDoctorProfile(payload) {
  try {
    const { data } = await api.put('/doctor/profile', payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err) };
  }
}

export async function detectCancer(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const { data } = await api.post('/detection/breast-cancer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: getErrorMessage(err) };
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(DEMO_USER_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function isDemoSession() {
  return getStoredToken() === DEMO_TOKEN;
}
