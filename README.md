# Elpis Frontend

Simple React + Vite frontend for the **Elpis** healthcare graduation project: doctor auth, patient list/history, profile, and breast ultrasound AI detection UI.

## Prerequisites

- Node.js 18+ recommended
- Backend API (default base URL in `.env`)

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Environment

- `VITE_API_URL` — API base URL (see `.env`). Vite exposes only variables prefixed with `VITE_`.

## Project layout

- `src/api.js` — Axios instance and all API helpers; JWT stored in `localStorage` under `elpis_token`.
- `src/pages/` — Login, Register, Dashboard, DoctorProfile, PatientsTable, PatientHistory, BreastCancerDetection.
- `src/components/` — Navbar, ImageUploader.
- `public/` — Static assets. **`index.html` for Vite must live in the project root** (same folder as `package.json`) so `npm run dev` works; a copy under `public/` is optional for reference only.

## Styling

- **Tailwind CSS** (`tailwind.config.js`, `postcss.config.js`) with utilities used in JSX `className`s where helpful.
- **Shared rules** live in `src/index.css`: `@tailwind` layers plus `.elpis-*` component classes built with `@apply`. There is no inline `style={{}}` in components.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

## API expectations (adjust backend to match)

| Function | Method | Path (under `VITE_API_URL`) |
|----------|--------|-----------------------------|
| Login | POST | `/auth/login` |
| Register | POST | `/auth/register` |
| Patients list | GET | `/patients` |
| Patient history | GET | `/patients/:id/history` |
| Doctor profile | GET | `/doctor/profile` |
| Update profile | PUT | `/doctor/profile` |
| Detection | POST (multipart) | `/detection/breast-cancer` |

Responses can use flexible field names; the UI normalizes common variants (see comments in `src/api.js`).

## License

Educational use — graduation project.
