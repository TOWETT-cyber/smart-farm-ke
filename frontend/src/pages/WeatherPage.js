import React, { useState } from 'react';
import { getWeatherAdvice } from '../utils/api';

const COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika',
  'Kitale','Machakos','Meru','Nyeri','Kakamega','Kisii',
  'Garissa','Embu','Kericho'
];

const CROPS = ['Maize','Tomato','Bean','Potato','Kale','Cassava','Wheat','Tea','Coffee','Other'];

const WEATHER_ICONS = {
  0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️',
  45:'🌫️', 48:'🌫️',
  51:'🌦️', 53:'🌦️', 55:'🌧️',
  61:'🌧️', 63:'🌧️', 65:'🌨️',
  80:'🌦️', 81:'🌧️', 82:'⛈️',
  95:'⛈️', 99:'⛈️',
};

const LABELS = {
  en: {
    title: 'Weather & Farming Advisory',
    countyLabel: 'Select your county',
    cropLabel: 'Crop you are growing (optional)',
    submit: 'Get Weather Advice',
    loading: 'Fetching weather data...',
    current: 'Current Weather',
    forecast: '7-Day Forecast',
    advice: 'Farming Advice',
    warnings: 'Warnings',
    best: 'Best Activities This Week',
    avoid: 'What to Avoid',
  },
  sw: {
    title: 'Hali ya Hewa na Ushauri',
    countyLabel: 'Chagua kaunti yako',
    cropLabel: 'Zao unalolima (si lazima)',
    submit: 'Pata Ushauri wa Hewa',
    loading: 'Inakusanya data ya hewa...',
    current: 'Hali ya Hewa Sasa',
    forecast: 'Utabiri wa Siku 7',
    advice: 'Ushauri wa Kilimo',
    warnings: 'Maonyo',
    best: 'Shughuli Bora Wiki Hii',
    avoid: 'Kinachopaswa Kuepukwa',
  },
};

export default function WeatherPage({ language }) {
  const [county, setCounty] = useState('');
  const [crop, setCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const t = LABELS[language] || LABELS.en;

  const handleSubmit = async () => {
    if (!county) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const result = await getWeatherAdvice(county, crop, language);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRainColor = (mm) => {
    if (mm >= 20) return '#ef4444';
    if (mm >= 10) return '#f97316';
    if (mm >= 3)  return '#3b82f6';
    return '#22c55e';
  };

  return (
    <div className="feature-page">
      <h2 className="page-title">{t.title}</h2>

      <div className="form-card">
        <div className="form-group">
          <label className="form-label">{t.countyLabel}</label>
          <select className="form-select" value={county} onChange={e => setCounty(e.target.value)}>
            <option value="">-- Select county --</option>
            {COUNTIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t.cropLabel}</label>
          <select className="form-select" value={crop} onChange={e => setCrop(e.target.value)}>
            <option value="">-- Optional --</option>
            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button
          className={`analyze-btn ${!county || loading ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!county || loading}
        >
          {loading
            ? <span className="loading-text"><span className="spinner" /> {t.loading}</span>
            : t.submit}
        </button>
      </div>

      {data && (
        <div className="results-container">
          <div className="result-card">
            <div className="section-label">{t.current} — {county.charAt(0).toUpperCase() + county.slice(1)}</div>
            <div className="current-weather-row">
              <span className="weather-big-icon">{WEATHER_ICONS[data.current.weathercode] || '🌤️'}</span>
              <div className="current-temp">{data.current.temp}°C</div>
              <div className="current-meta">💨 {data.current.windspeed} km/h</div>
            </div>
            {data.advice?.summary && <p className="section-text" style={{marginTop:12}}>{data.advice.summary}</p>}
          </div>

          <div className="result-card">
            <div className="section-label">{t.forecast}</div>
            <div className="forecast-scroll">
              {data.forecast?.map((day, i) => (
                <div key={i} className="forecast-day">
                  <div className="forecast-date">
                    {new Date(day.date).toLocaleDateString('en-KE', { weekday:'short', day:'numeric' })}
                  </div>
                  <div className="forecast-temps">{day.minTemp}–{day.maxTemp}°C</div>
                  <div className="forecast-rain" style={{ color: getRainColor(day.rainfall) }}>
                    {day.rainfall}mm
                  </div>
                  <div className="forecast-chance">{day.rainChance}%</div>
                </div>
              ))}
            </div>
          </div>

          {data.advice?.warnings?.length > 0 && (
            <div className="result-card warning-card">
              <div className="section-label">⚠️ {t.warnings}</div>
              {data.advice.warnings.map((w, i) => (
                <p key={i} className="warning-text">{w}</p>
              ))}
            </div>
          )}

          {data.advice?.farmingAdvice?.length > 0 && (
            <div className="result-card">
              <div className="section-label">{t.advice}</div>
              <ul className="tip-list">
                {data.advice.farmingAdvice.map((tip, i) => (
                  <li key={i} className="tip-item"><span className="tip-icon">✓</span><span>{tip}</span></li>
                ))}
              </ul>
            </div>
          )}

          {data.advice?.bestActivities?.length > 0 && (
            <div className="result-card">
              <div className="section-label">✅ {t.best}</div>
              <ul className="tip-list">
                {data.advice.bestActivities.map((a, i) => (
                  <li key={i} className="tip-item"><span className="tip-icon">🌾</span><span>{a}</span></li>
                ))}
              </ul>
            </div>
          )}

          {data.advice?.avoidActivities?.length > 0 && (
            <div className="result-card">
              <div className="section-label">🚫 {t.avoid}</div>
              <ul className="tip-list">
                {data.advice.avoidActivities.map((a, i) => (
                  <li key={i} className="tip-item">
                    <span className="tip-icon" style={{color:'#ef4444'}}>✗</span><span>{a}</span>
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