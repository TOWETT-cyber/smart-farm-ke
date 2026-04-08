import React, { useState } from 'react';
import { getFertilizerAdvice } from '../utils/api';

const CROPS = ['Maize','Tomato','Bean','Potato','Kale','Cassava','Wheat','Rice','Tea','Coffee','Other'];
const SOIL_COLORS = ['Dark/Black','Red/Brown','Light Brown','Sandy/Yellow','Grey/Waterlogged'];

const LABELS = {
  en: {
    title: 'Fertilizer & Soil Advisor',
    cropLabel: 'What crop are you growing?',
    soilLabel: 'Soil color / appearance',
    symptomsLabel: 'Any plant symptoms?',
    symptomsPlaceholder: 'e.g. Leaves turning yellow, slow growth...',
    submit: 'Get Fertilizer Advice',
    loading: 'Analyzing soil needs...',
    soilHealth: 'Soil Assessment',
    deficiencies: 'Likely Nutrient Gaps',
    recommendations: 'Fertilizer Recommendations',
    organic: 'Organic Alternatives',
    tips: 'Soil Health Tips',
    amount: 'Amount',
    timing: 'When',
    reason: 'Why',
  },
  sw: {
    title: 'Mshauri wa Mbolea na Udongo',
    cropLabel: 'Unalima zao gani?',
    soilLabel: 'Rangi ya udongo',
    symptomsLabel: 'Kuna dalili zozote?',
    symptomsPlaceholder: 'Mfano: Majani yanageuka njano...',
    submit: 'Pata Ushauri wa Mbolea',
    loading: 'Inachambua udongo...',
    soilHealth: 'Tathmini ya Udongo',
    deficiencies: 'Lishe Inayokosekana',
    recommendations: 'Mapendekezo ya Mbolea',
    organic: 'Mbadala za Asili',
    tips: 'Vidokezo vya Udongo',
    amount: 'Kiasi',
    timing: 'Wakati',
    reason: 'Sababu',
  },
};

export default function FertilizerPage({ language }) {
  const [crop, setCrop] = useState('');
  const [soilColor, setSoilColor] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const t = LABELS[language] || LABELS.en;

  const handleSubmit = async () => {
    if (!crop) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await getFertilizerAdvice(crop, soilColor, symptoms, language);
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <h2 className="page-title">{t.title}</h2>

      <div className="form-card">
        <div className="form-group">
          <label className="form-label">{t.cropLabel}</label>
          <select className="form-select" value={crop} onChange={e => setCrop(e.target.value)}>
            <option value="">-- Select crop --</option>
            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t.soilLabel}</label>
          <select className="form-select" value={soilColor} onChange={e => setSoilColor(e.target.value)}>
            <option value="">-- Select soil type --</option>
            {SOIL_COLORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t.symptomsLabel}</label>
          <textarea
            className="form-textarea"
            placeholder={t.symptomsPlaceholder}
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            rows={3}
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button
          className={`analyze-btn ${!crop || loading ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!crop || loading}
        >
          {loading
            ? <span className="loading-text"><span className="spinner" /> {t.loading}</span>
            : t.submit}
        </button>
      </div>

      {result && (
        <div className="results-container">
          <div className="result-card">
            <div className="section-label">{t.soilHealth}</div>
            <p className="section-text">{result.soilHealth}</p>
          </div>

          {result.deficiencies?.length > 0 && (
            <div className="result-card">
              <div className="section-label">{t.deficiencies}</div>
              <div className="tag-list">
                {result.deficiencies.map((d, i) => (
                  <span key={i} className="tag tag-warning">{d}</span>
                ))}
              </div>
            </div>
          )}

          {result.recommendations?.length > 0 && (
            <div className="result-card">
              <div className="section-label">{t.recommendations}</div>
              {result.recommendations.map((rec, i) => (
                <div key={i} className="fert-rec">
                  <div className="fert-name">{rec.fertilizer}</div>
                  <div className="fert-row"><span className="fert-key">{t.amount}:</span> {rec.amount}</div>
                  <div className="fert-row"><span className="fert-key">{t.timing}:</span> {rec.timing}</div>
                  <div className="fert-row"><span className="fert-key">{t.reason}:</span> {rec.reason}</div>
                </div>
              ))}
            </div>
          )}

          {result.organicOptions?.length > 0 && (
            <div className="result-card">
              <div className="section-label">{t.organic}</div>
              <ul className="tip-list">
                {result.organicOptions.map((o, i) => (
                  <li key={i} className="tip-item">
                    <span className="tip-icon">🌱</span><span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.tips?.length > 0 && (
            <div className="result-card">
              <div className="section-label">{t.tips}</div>
              <ul className="tip-list">
                {result.tips.map((tip, i) => (
                  <li key={i} className="tip-item">
                    <span className="tip-icon">✓</span><span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}