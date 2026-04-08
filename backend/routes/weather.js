const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const COUNTIES = {
  nairobi:   { lat: -1.2921, lon: 36.8219 },
  mombasa:   { lat: -4.0435, lon: 39.6682 },
  kisumu:    { lat: -0.0917, lon: 34.7680 },
  nakuru:    { lat: -0.3031, lon: 36.0800 },
  eldoret:   { lat:  0.5143, lon: 35.2698 },
  thika:     { lat: -1.0332, lon: 37.0693 },
  kitale:    { lat:  1.0154, lon: 35.0062 },
  machakos:  { lat: -1.5177, lon: 37.2634 },
  meru:      { lat:  0.0500, lon: 37.6490 },
  nyeri:     { lat: -0.4169, lon: 36.9479 },
  kakamega:  { lat:  0.2827, lon: 34.7519 },
  kisii:     { lat: -0.6817, lon: 34.7667 },
  garissa:   { lat: -0.4532, lon: 42.5200 },
  embu:      { lat: -0.5301, lon: 37.4581 },
  kericho:   { lat: -0.3686, lon: 35.2863 },
};

router.post('/', async (req, res) => {
  try {
    const { county, crop, language = 'en' } = req.body;
    if (!county) return res.status(400).json({ error: 'County is required' });

    const coords = COUNTIES[county.toLowerCase()] || COUNTIES.nairobi;

    // Fetch real weather from Open-Meteo (free, no API key needed)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max&current_weather=true&timezone=Africa%2FNairobi&forecast_days=7`;
    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();

    const current = weatherData.current_weather;
    const daily = weatherData.daily;

    const forecast = daily.time.map((date, i) => ({
      date,
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      rainfall: daily.precipitation_sum[i],
      rainChance: daily.precipitation_probability_max[i],
      wind: daily.windspeed_10m_max[i],
    }));

    const weatherSummary = `Current: ${current.temperature}°C, wind ${current.windspeed}km/h.
7-day: ${forecast.map(d => `${d.date}: ${d.minTemp}-${d.maxTemp}°C, ${d.rainfall}mm rain (${d.rainChance}% chance)`).join('; ')}`;

    const prompt = language === 'sw'
      ? `Wewe ni mshauri wa kilimo Kenya. Hali ya hewa ${county}: ${weatherSummary}. Zao: ${crop || 'yoyote'}.
Jibu KWA JSON TU:
{
  "summary": "Muhtasari wa hali ya hewa",
  "farmingAdvice": ["Ushauri 1", "Ushauri 2", "Ushauri 3"],
  "warnings": ["Onyo kama kipo"],
  "bestActivities": ["Shughuli nzuri 1", "Shughuli 2"],
  "avoidActivities": ["Epuka 1", "Epuka 2"]
}`
      : `You are an agricultural advisor for Kenyan farmers.
Weather in ${county}: ${weatherSummary}. Crop: ${crop || 'general'}.
Respond ONLY with valid JSON:
{
  "summary": "1-2 sentence weather summary",
  "farmingAdvice": ["Tip 1", "Tip 2", "Tip 3"],
  "warnings": ["Warning if any"],
  "bestActivities": ["Best activity 1", "Activity 2"],
  "avoidActivities": ["Avoid 1", "Avoid 2"]
}
Be specific to Kenyan farming. Keep advice practical and affordable.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text();
    let advice;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      advice = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      advice = { summary: rawText, farmingAdvice: [], warnings: [], bestActivities: [], avoidActivities: [] };
    }

    res.json({
      county,
      current: { temp: current.temperature, windspeed: current.windspeed, weathercode: current.weathercode },
      forecast,
      advice,
    });

  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: error.message || 'Weather advisory failed' });
  }
});

router.get('/counties', (req, res) => {
  res.json(Object.keys(COUNTIES));
});

module.exports = router;