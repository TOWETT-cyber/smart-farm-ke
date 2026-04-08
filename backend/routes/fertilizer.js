const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPT = {
  en: (crop, soilColor, symptoms) => `You are an expert agronomist advising smallholder farmers in Kenya.
Crop: ${crop}
Soil appearance: ${soilColor || 'not described'}
Plant symptoms: ${symptoms || 'none'}

Respond ONLY with valid JSON:
{
  "soilHealth": "Brief soil assessment",
  "deficiencies": ["Nutrient 1", "Nutrient 2"],
  "recommendations": [
    { "fertilizer": "Name", "amount": "Per acre", "timing": "When to apply", "reason": "Why" }
  ],
  "organicOptions": ["Option 1", "Option 2"],
  "tips": ["Tip 1", "Tip 2"]
}
Prioritize affordable fertilizers available in Kenya: DAP, CAN, urea, compost, manure.`,

  sw: (crop, soilColor, symptoms) => `Wewe ni mtaalamu wa kilimo Kenya.
Zao: ${crop}
Udongo: ${soilColor || 'haijaelezwa'}
Dalili: ${symptoms || 'hakuna'}

Jibu KWA JSON TU:
{
  "soilHealth": "Tathmini ya udongo",
  "deficiencies": ["Lishe 1", "Lishe 2"],
  "recommendations": [
    { "fertilizer": "Jina", "amount": "Kwa ekari", "timing": "Wakati", "reason": "Sababu" }
  ],
  "organicOptions": ["Mbadala 1", "Mbadala 2"],
  "tips": ["Ushauri 1", "Ushauri 2"]
}
Pendekeza mbolea za bei nafuu: DAP, CAN, urea, mboji, samadi.`
};

router.post('/', async (req, res) => {
  try {
    const { crop, soilColor, symptoms, language = 'en' } = req.body;
    if (!crop) return res.status(400).json({ error: 'Crop type is required' });

    const prompt = PROMPT[language]
      ? PROMPT[language](crop, soilColor, symptoms)
      : PROMPT.en(crop, soilColor, symptoms);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text();
    let result;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      result = { soilHealth: rawText, deficiencies: [], recommendations: [], organicOptions: [], tips: [] };
    }

    res.json({ result });
  } catch (error) {
    console.error('Fertilizer error:', error);
    res.status(500).json({ error: error.message || 'Recommendation failed' });
  }
});

module.exports = router;