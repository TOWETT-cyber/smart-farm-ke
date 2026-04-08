import React, { useState } from 'react';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import FertilizerPage from './pages/FertilizerPage';
import WeatherPage from './pages/WeatherPage';
import DairyPage from './pages/DairyPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

export default function App() {
  const [page, setPage] = useState('diagnose');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('en');

  const NAV = [
    { id: 'diagnose',   en: 'Disease',    sw: 'Ugonjwa',  icon: '🔬' },
    { id: 'fertilizer', en: 'Fertilizer', sw: 'Mbolea',   icon: '🌱' },
    { id: 'weather',    en: 'Weather',    sw: 'Hewa',     icon: '🌦️' },
    { id: 'dairy',      en: 'Dairy',      sw: 'Maziwa',   icon: '🐄' },
    { id: 'history',    en: 'History',    sw: 'Historia', icon: '📋' },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-leaf">🌾</span>
            <div>
              <div className="logo-title">SMART FARM KE</div>
              <div className="logo-sub">
                {language === 'sw' ? 'Msaada wa Kilimo' : 'AI Farming Assistant'}
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >EN</button>
            <button
              className={`lang-btn ${language === 'sw' ? 'active' : ''}`}
              onClick={() => setLanguage('sw')}
            >SW</button>
          </div>
        </div>
        <nav className="nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-btn ${page === n.id || (page === 'result' && n.id === 'diagnose') ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span>{language === 'sw' ? n.sw : n.en}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {page === 'diagnose' && (
          <UploadPage
            language={language}
            onResult={(data) => { setResult(data); setPage('result'); }}
          />
        )}
        {page === 'result' && result && (
          <ResultPage
            language={language}
            result={result}
            onBack={() => setPage('diagnose')}
          />
        )}
        {page === 'fertilizer' && <FertilizerPage language={language} />}
        {page === 'weather'    && <WeatherPage    language={language} />}
        {page === 'dairy'      && <DairyPage      language={language} />}
        {page === 'history'    && <HistoryPage    language={language} />}
      </main>
    </div>
  );
}