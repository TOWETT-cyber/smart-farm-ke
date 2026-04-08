import React, { useState, useRef } from 'react';
import { diagnoseImage } from '../utils/api';

const CROPS = ['Maize', 'Tomato', 'Bean', 'Potato', 'Kale', 'Cassava', 'Wheat', 'Rice', 'Tea', 'Coffee', 'Other'];

const LABELS = {
  en: {
    title: 'Crop Disease Diagnosis',
    subtitle: 'Take or upload a photo of your crop',
    selectCrop: 'Select crop type (optional)',
    analyze: 'Diagnose Crop',
    loading: 'Analyzing your crop...',
    drag: 'Tap to upload photo',
    or: 'or drag and drop',
    note: 'Best results: clear photo in good lighting',
  },
  sw: {
    title: 'Uchunguzi wa Magonjwa',
    subtitle: 'Piga au pakia picha ya zao lako',
    selectCrop: 'Chagua aina ya zao (si lazima)',
    analyze: 'Gundua Zao',
    loading: 'Inachambua zao lako...',
    drag: 'Gusa kupakia picha',
    or: 'au buruta na udondoshe',
    note: 'Matokeo bora: picha wazi katika mwanga mzuri',
  },
};

export default function UploadPage({ language, onResult }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const t = LABELS[language] || LABELS.en;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    try {
      const data = await diagnoseImage(image, cropType, language);
      onResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <h2 className="page-title">{t.title}</h2>
      <p className="page-subtitle">{t.subtitle}</p>

      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-image' : ''}`}
        onClick={() => fileRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
      >
        {preview ? (
          <img src={preview} alt="Crop preview" className="preview-img" />
        ) : (
          <div className="drop-placeholder">
            <div className="drop-icon">📷</div>
            <div className="drop-text">{t.drag}</div>
            <div className="drop-sub">{t.or}</div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      <p className="upload-note">{t.note}</p>

      <select
        className="form-select"
        value={cropType}
        onChange={(e) => setCropType(e.target.value)}
      >
        <option value="">{t.selectCrop}</option>
        {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {error && <div className="error-msg">{error}</div>}

      <button
        className={`analyze-btn ${!image || loading ? 'disabled' : ''}`}
        onClick={handleSubmit}
        disabled={!image || loading}
      >
        {loading
          ? <span className="loading-text"><span className="spinner" /> {t.loading}</span>
          : t.analyze}
      </button>
    </div>
  );
}