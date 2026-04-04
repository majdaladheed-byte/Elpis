import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { detectCancer } from '../api';

function buildRecommendations(prediction, riskLevel) {
  const p = String(prediction || '').toLowerCase();
  const benign = p.includes('benign') || p === 'b' || p === '0';
  if (benign) {
    return [
      'Continue routine breast screening as advised by your specialist.',
      'Maintain a healthy lifestyle and report any new changes promptly.',
      'Ultrasound suggests a benign pattern; correlate with clinical exam.',
    ];
  }
  return [
    'Urgent referral to oncology or breast specialist is recommended.',
    'Additional imaging (e.g., mammography, MRI) may be required.',
    'Discuss biopsy options and treatment planning with the care team.',
  ];
}

function formatConfidence(val) {
  if (val == null) return '—';
  const n = Number(val);
  if (Number.isNaN(n)) return String(val);
  if (n <= 1) return `${Math.round(n * 100)}%`;
  return `${Math.round(n)}%`;
}

export default function BreastCancerDetection() {
  const [file, setFile] = useState(null);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saveNote, setSaveNote] = useState('');

  async function handleDetect() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await detectCancer(file);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      setResult(res.data);
    } catch (err) {
      alert(err.message || 'Detection failed');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setFile(null);
    setResult(null);
    setSaveNote('');
    setUploaderKey((k) => k + 1);
  }

  function handleSaveMock() {
    alert('This is a UI mock: connect your backend to save results to patient history.');
    setSaveNote('(Mock) Result would be linked to a patient record once the API exists.');
  }

  const prediction = result?.prediction ?? result?.label ?? result?.class;
  const confidence = result?.confidence ?? result?.probability ?? result?.score;
  const riskLevel = result?.riskLevel ?? result?.risk ?? (prediction ? String(prediction) : '—');
  const recommendations = result?.recommendations || buildRecommendations(prediction, riskLevel);

  return (
    <div className="elpis-page elpis-page-narrow-xl">
      <h1 className="mb-1.5">Breast cancer detection</h1>
      <p className="elpis-prose-tight max-w-[560px]">
        Upload an ultrasound image for AI-assisted analysis. Results support clinical decision-making and must always be
        confirmed by a qualified physician.
      </p>

      <ImageUploader key={uploaderKey} onImageSelect={setFile} />

      <div className="elpis-detection-actions">
        <button
          type="button"
          className="elpis-btn elpis-btn-primary"
          disabled={!file || loading}
          onClick={handleDetect}
        >
          {loading ? 'Analyzing…' : 'Detect cancer'}
        </button>
        <button type="button" className="elpis-btn elpis-btn-secondary" onClick={handleClear}>
          Clear
        </button>
        {loading && (
          <span className="inline-flex items-center gap-2 elpis-muted">
            <span className="elpis-spinner elpis-spinner-xs" />
            Processing image…
          </span>
        )}
      </div>

      {result && (
        <div className="elpis-detection-result">
          <h2 className="mb-4 text-lg font-semibold">Analysis result</h2>
          <div className="elpis-result-grid">
            <div className="elpis-result-tile-teal">
              <p className="elpis-result-label">Prediction</p>
              <p className="elpis-result-value">{prediction ?? '—'}</p>
            </div>
            <div className="elpis-result-tile-cyan">
              <p className="elpis-result-label elpis-result-label-cyan">Confidence</p>
              <p className="elpis-result-value">{formatConfidence(confidence)}</p>
            </div>
            <div className="elpis-result-tile-muted">
              <p className="elpis-result-label elpis-result-label-muted">Risk level</p>
              <p className="elpis-result-value">{riskLevel}</p>
            </div>
          </div>
          <h3 className="mb-2 text-sm font-semibold">Recommendations</h3>
          <ul className="elpis-recommendations">
            {(Array.isArray(recommendations) ? recommendations : [recommendations]).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>

          <div className="elpis-result-footer">
            <button type="button" className="elpis-btn elpis-btn-secondary" onClick={handleSaveMock}>
              Save to patient history (mock)
            </button>
            {saveNote && <span className="text-sm elpis-muted">{saveNote}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
