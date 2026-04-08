import React from 'react';

const SEVERITY_COLOR = {
  Mild: '#f59e0b',
  Moderate: '#f97316',
  Severe: '#ef4444',
  Healthy: '#22c55e',
  'Afya Njema': '#22c55e',
  Wastani: '#f97316',
  Kali: '#ef4444',
  Kidogo: '#f59e0b',
};

const LABELS = {
  en: {
    disease: 'Condition Detected',
    cause: 'Cause',
    treatment: 'Treatment Steps',
    prevention: 'Prevention Tips',
    back: '← Diagnose Another',
    share: 'Share Result',
  },
  sw: {
    disease: 'Tatizo Lililogundulika',
    cause: 'Sababu',
    treatment: 'Hatua za Matibabu',
    prevention: 'Vidokezo vya Kuzuia',
    back: '← Chunguza Nyingine',
    share: 'Shiriki Matokeo',
  },
};

export default function ResultPage({ result, language, onBack }) {
  const t = LABELS[language] || LABELS.en;
  const { imageUrl, result: diagnosis } = result;
  const severityColor = SEVERITY_COLOR[diagnosis.severity] || '#6b7280';

  const handleShare = async () => {
    const text = `SMART FARM KE Diagnosis:\n${diagnosis.diseaseName}\nSeverity: ${diagnosis.severity}\n\nTreatment:\n${diagnosis.treatment?.join('\n')}`;
    if (navigator.share) {
      await navigator.share({ title: 'SMART FARM KE Result', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="feature-page">
      <img src={imageUrl} alt="Diagnosed crop" className="result-img" />

      <div className="result-card">
        <div className="result-header">
          <div className="disease-name">{diagnosis.diseaseName}</div>
          <span className="severity-badge" style={{ background: severityColor }}>
            {diagnosis.severity}
          </span>
        </div>

        <div className="result-section">
          <div className="section-label">{t.cause}</div>
          <p className="section-text">{diagnosis.cause}</p>
        </div>

        {diagnosis.treatment?.length > 0 && (
          <div className="result-section">
            <div className="section-label">{t.treatment}</div>
            <ol className="step-list">
              {diagnosis.treatment.map((step, i) => (
                <li key={i} className="step-item">
                  <span className="step-num">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {diagnosis.prevention?.length > 0 && (
          <div className="result-section">
            <div className="section-label">{t.prevention}</div>
            <ul className="tip-list">
              {diagnosis.prevention.map((tip, i) => (
                <li key={i} className="tip-item">
                  <span className="tip-icon">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="result-actions">
        <button className="back-btn" onClick={onBack}>{t.back}</button>
        <button className="share-btn" onClick={handleShare}>{t.share}</button>
      </div>
    </div>
  );
}