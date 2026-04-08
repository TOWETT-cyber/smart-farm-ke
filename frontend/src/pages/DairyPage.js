import React, { useState } from 'react';
import { getDairyAdvice } from '../utils/api';

const ANIMALS = ['Dairy Cow', 'Goat', 'Sheep', 'Camel', 'Donkey'];

const ISSUES = [
  'Low milk production',
  'Animal not eating',
  'Swollen udder / mastitis',
  'Diarrhea / loose stool',
  'Limping / leg problem',
  'Skin disease / ticks',
  'Pregnancy / calving help',
  'Feeding advice',
  'Other',
];

const LABELS = {
  en: {
    title: 'Dairy & Livestock Advisor',
    animalLabel: 'Type of animal',
    issueLabel: 'What is the problem?',
    symptomsLabel: 'Describe symptoms in detail',
    symptomsPlaceholder: 'e.g. Cow has not eaten for 2 days, produces very little milk, seems weak...',
    submit: 'Get Advice',
    loading: 'Analyzing the problem...',
    diagnosis: 'Assessment',
    urgency: 'Urgency Level',
    immediate: 'Immediate Actions',
    treatment: 'Treatment Steps',
    prevention: 'Prevention Tips',
    feeding: 'Feeding Advice',
    vet: '⚠️ Please call a vet as soon as possible!',
  },
  sw: {
    title: 'Mshauri wa Mifugo na Maziwa',
    animalLabel: 'Aina ya mnyama',
    issueLabel: 'Tatizo ni nini?',
    symptomsLabel: 'Elezea dalili kwa undani',
    symptomsPlaceholder: 'Mfano: Ng\'ombe hajala siku 2, maziwa kidogo, anaonekana dhaifu...',
    submit: 'Pata Ushauri',
    loading: 'Inachambua tatizo...',
    diagnosis: 'Tathmini',
    urgency: 'Kiwango cha Haraka',
    immediate: 'Hatua za Haraka',
    treatment: 'Matibabu',
    prevention: 'Kuzuia',
    feeding: 'Ushauri wa Kulisha',
    vet: '⚠️ Tafadhali piga simu daktari wa mifugo haraka iwezekanavyo!',
  },
};

const URGENCY_COLOR = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#f97316',
  Emergency: '#ef4444',
  Chini: '#22c55e',
  Wastani: '#f59e0b',
  Juu: '#f97316',
  Dharura: '#ef4444',
};

export default function DairyPage({ language }) {
  const [animalType, setAnimalType] = useState('');
  const [issue, setIssue] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const t = LABELS[language] || LABELS.en;

  const handleSubmit = async () => {
    if (!issue) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await getDairyAdvice(issue, animalType, symptoms, language);
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
          <label className="form-label">{t.animalLabel}</label>
          <select className="form-select" value={animalType} onChange={e => setAnimalType(e.target.value)}>
            <option value="">-- Select animal --</option>
            {ANIMALS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t.issueLabel}</label>
          <select className="form-select" value={issue} onChange={e => setIssue(e.target.value)}>
            <option value="">-- Select problem --</option>
            {ISSUES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t.symptomsLabel}</label>
          <textarea
            className="form-textarea"
            placeholder={t.symptomsPlaceholder}
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            rows={4}
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button
          className={`analyze-btn ${!issue || loading ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!issue || loading}
        >
          {loading
            ? <span className="loading-text"><span className="spinner" /> {t.loading}</span>
            : t.submit}
        </button>
      </div>

      {result && (
        <div className="results-container">

          {result.vetRequired && (
            <div className="result-card warning-card">
              <p className="warning-text">{t.vet}</p>
            </div>
          )}

          <div className="result-card">
            <div className="result-header">
              <div>
                <div className="section-label">{t.diagnosis}</div>
                <p className="section-text">{result.diagnosis}</p>
              </div>
              <span
                className="severity-badge"
                style={{ background: URGENCY_COLOR[result.urgency] || '#6b7280' }}
              >
                {result.urgency}
              </span>
            </div>
          </div>

          {result.immediateActions?.length > 0 && (
            <div className="result-card">
              <div className="section-label">⚡ {t.immediate}</div>
              <ol className="step-list">
                {result.immediateActions.map((action, i) => (
                  <li key={i} className="step-item">
                    <span className="step-num">{i + 1}</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {result.treatment?.length > 0 && (
            <div className="result-card">
              <div className="section-label">{t.treatment}</div>
              <ol className="step-list">
                {result.treatment.map((step, i) => (
                  <li key={i} className="step-item">
                    <span className="step-num">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {result.feedingAdvice && (
            <div className="result-card">
              <div className="section-label">🥬 {t.feeding}</div>
              <p className="section-text">{result.feedingAdvice}</p>
            </div>
          )}

          {result.prevention?.length > 0 && (
            <div className="result-card">
              <div className="section-label">{t.prevention}</div>
              <ul className="tip-list">
                {result.prevention.map((tip, i) => (
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