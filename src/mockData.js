/**
 * Hardcoded demo data for dummy login (no backend).
 * Used when the session token is elpis-demo — see api.js
 */

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/** List for Dashboard + Patients table */
export const mockPatients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    age: 52,
    gender: 'Female',
    lastVisit: isoToday(),
    recentDetection: true,
    lastDetection: '2026-04-01',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    age: 47,
    gender: 'Female',
    lastVisit: isoDaysAgo(1),
    recentDetection: false,
  },
  {
    id: 3,
    name: 'Emily Chen',
    age: 39,
    gender: 'Female',
    lastVisit: isoDaysAgo(3),
    recentDetection: true,
  },
  {
    id: 4,
    name: 'Aisha Rahman',
    age: 55,
    gender: 'Female',
    lastVisit: isoDaysAgo(5),
    recentDetection: false,
  },
  {
    id: 5,
    name: 'Linda Okafor',
    age: 44,
    gender: 'Female',
    lastVisit: isoDaysAgo(7),
    recentDetection: false,
  },
  {
    id: 6,
    name: 'Helen Park',
    age: 61,
    gender: 'Female',
    lastVisit: isoDaysAgo(10),
    recentDetection: true,
  },
  {
    id: 7,
    name: 'Rachel Meyer',
    age: 41,
    gender: 'Female',
    lastVisit: isoDaysAgo(14),
    recentDetection: false,
  },
];

/** Full history keyed by patient id (string) */
export const mockPatientHistories = {
  '1': {
    patient: {
      name: 'Sarah Johnson',
      age: 52,
      gender: 'Female',
      bloodType: 'A+',
    },
    visits: [
      {
        id: 'v1-1',
        date: isoToday(),
        diagnosis: 'Routine ultrasound follow-up',
        notes: 'Stable findings. Continue annual screening.',
        ultrasoundResults: 'Birads 2 — benign',
      },
      {
        id: 'v1-2',
        date: isoDaysAgo(90),
        diagnosis: 'Benign cyst',
        notes: 'Small fluid-filled cyst; no intervention needed.',
        ultrasoundUrl: 'https://example.com/demo-ultrasound-placeholder',
      },
    ],
  },
  '2': {
    patient: {
      name: 'Maria Garcia',
      age: 47,
      gender: 'Female',
      bloodType: 'O+',
    },
    visits: [
      {
        id: 'v2-1',
        date: isoDaysAgo(1),
        diagnosis: 'Screening mammography referral',
        notes: 'Patient referred for additional imaging based on family history.',
      },
    ],
  },
  '3': {
    patient: {
      name: 'Emily Chen',
      age: 39,
      gender: 'Female',
      bloodType: 'B+',
    },
    visits: [
      {
        id: 'v3-1',
        date: isoDaysAgo(3),
        diagnosis: 'Fibroadenoma suspected',
        notes: 'Correlate with physical exam; consider short-interval follow-up.',
        ultrasoundResults: 'Well-circumscribed hypoechoic mass',
      },
      {
        id: 'v3-2',
        date: isoDaysAgo(120),
        diagnosis: 'Normal screening',
        notes: 'No suspicious findings.',
      },
    ],
  },
  '4': {
    patient: {
      name: 'Aisha Rahman',
      age: 55,
      gender: 'Female',
      bloodType: 'AB+',
    },
    visits: [
      {
        id: 'v4-1',
        date: isoDaysAgo(5),
        diagnosis: 'Post-treatment surveillance',
        notes: 'Oncology follow-up coordinated.',
      },
    ],
  },
  '5': {
    patient: {
      name: 'Linda Okafor',
      age: 44,
      gender: 'Female',
      bloodType: 'A-',
    },
    visits: [
      {
        id: 'v5-1',
        date: isoDaysAgo(7),
        diagnosis: 'Breast pain evaluation',
        notes: 'Cyclical pain; reassurance and supportive care.',
      },
    ],
  },
  '6': {
    patient: {
      name: 'Helen Park',
      age: 61,
      gender: 'Female',
      bloodType: 'O-',
    },
    visits: [
      {
        id: 'v6-1',
        date: isoDaysAgo(10),
        diagnosis: 'High-risk screening',
        notes: 'MRI scheduled; genetic counseling discussed.',
      },
    ],
  },
  '7': {
    patient: {
      name: 'Rachel Meyer',
      age: 41,
      gender: 'Female',
      bloodType: 'B-',
    },
    visits: [
      {
        id: 'v7-1',
        date: isoDaysAgo(14),
        diagnosis: 'Annual wellness visit',
        notes: 'All vitals stable; breast self-exam education reinforced.',
      },
    ],
  },
};

export function getMockPatientHistory(patientId) {
  const key = String(patientId);
  const entry = mockPatientHistories[key];
  if (!entry) return null;
  return {
    patient: entry.patient,
    visits: entry.visits,
  };
}
