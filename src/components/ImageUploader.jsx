import { useState } from 'react';

const accept = 'image/jpeg,image/jpg,image/png';

export default function ImageUploader({ onImageSelect }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileName('');
      onImageSelect?.(null);
      return;
    }
    const isOk = /image\/(jpeg|jpg|png)/i.test(file.type) || /\.(jpe?g|png)$/i.test(file.name);
    if (!isOk) {
      alert('Please choose a JPG or PNG image.');
      e.target.value = '';
      return;
    }
    setFileName(file.name);
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageSelect?.(file);
  }

  function handleClear() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName('');
    onImageSelect?.(null);
  }

  return (
    <div className="elpis-card elpis-card-pad">
      <label className="elpis-label" htmlFor="elpis-image-input">
        Ultrasound image (JPG or PNG)
      </label>
      <input id="elpis-image-input" type="file" accept={accept} onChange={handleChange} className="elpis-file-input" />
      {fileName && <p className="mb-2 text-sm elpis-muted">{fileName}</p>}
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="elpis-preview-img" />
          <button type="button" className="elpis-btn elpis-btn-secondary mt-3" onClick={handleClear}>
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
