import React, { useEffect, useState } from 'react';
import { getHistory } from '../utils/api';

const SEVERITY_COLOR = {
  Mild: '#f59e0b',
  Moderate: '#f97316',
  Severe: '#ef4444',
  Healthy: '#22c55e',
};

const LABELS = {
  en: {
    title: 'Past Diagnoses',
    empty: 'No diagnoses yet. Upload a crop photo to get started!',
    loading: 'Loading history...',
    unknown: 'Unknown condition',
    unknownCrop: 'Unknown crop',
  },
  sw: {
    title: 'Historia ya Uchunguzi',
    empty: 'Hakuna historia bado. Pakia picha ya zao kuanza!',
    loading: 'Inapakia historia...',
    unknown: 'Hali isiyojulikana',
    unknownCrop: 'Zao lisilojulikana',
  },
};

export default function HistoryPage({ language }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = LABELS[language] || LABELS.en;

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page">{t.loading}</div>;

  return (
    <div className="feature-page">
      <h2 className="page-title">{t.title}</h2>

      {history.length === 0 ? (
        <p className="empty-msg">{t.empty}</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item._id} className="history-card">
              <img src={item.imageUrl} alt="" className="history-thumb" />
              <div className="history-info">
                <div className="history-disease">
                  {item.result?.diseaseName || t.unknown}
                </div>
                <div className="history-crop">
                  {item.cropType || t.unknownCrop}
                </div>
                <div className="history-date">
                  {new Date(item.createdAt).toLocaleDateString('en-KE', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </div>
              </div>
              <span
                className="severity-badge"
                style={{ background: SEVERITY_COLOR[item.result?.severity] || '#6b7280' }}
              >
                {item.result?.severity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}