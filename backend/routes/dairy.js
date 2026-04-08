const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPT = {
  en: (issue, animalType, symptoms) => `You are an expert veterinarian and dairy farming advisor for smallholder farmers in Kenya.
Animal type: ${animalType || 'dairy cow'}
Problem / question: ${issue}
Symptoms observed: ${symptoms || 'none described'}

Respond ONLY with valid JSON:
{
  "diagnosis": "What is likely wrong or assessment of the situation",
  "urgency": "Low | Medium | High | Emergency",
  "immediateActions": ["Action 1", "Action 2"],
  "treatment": ["Treatment step 1", "Treatment step 2", "Treatment step 3"],
  "prevention": ["Prevention tip 1", "Prevention tip 2"],
  "feedingAdvice": "Specific feeding recommendation",
  "vetRequired": true or false
}
Prioritize affordable solutions available to rural Kenyan farmers.
If urgency is Emergency, always set vetRequired to true.`,

  sw: (issue, animalType, symptoms) => `Wewe ni daktari wa mifugo na mshauri wa ufugaji Kenya.
Aina ya mnyama: ${animalType || 'ng\'ombe wa maziwa'}
Tatizo: ${issue}
Dalili: ${symptoms || 'hakuna'}

Jibu KWA JSON TU:
{
  "diagnosis": "Tathmini ya hali",
  "urgency": "Chini | Wastani | Juu | Dharura",
  "immediateActions": ["Hatua 1", "Hatua 2"],
  "treatment": ["Matibabu 1", "Matibabu 2", "Matibabu 3"],
  "prevention": ["Kuzuia 1", "Kuzuia 2"],
  "feedingAdvice": "Ushauri wa kulisha",
  "vetRequired": kweli au uwongo
}
Pendekeza suluhisho za bei nafuu kwa wakulima wa Kenya.`
};

router.post('/', async (req, res) => {
  try {
    const { issue, animalType, symptoms, language = 'en' } = req.body;
    if (!issue) return res.status(400).json({ error: 'Please describe the problem' });

    const prompt = PROMPT[language]
      ? PROMPT[language](issue, animalType, symptoms)
      : PROMPT.en(issue, animalType, symptoms);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text();
    let result;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      result = {
        diagnosis: rawText,
        urgency: 'Medium',
        immediateActions: [],
        treatment: [],
        prevention: [],
        feedingAdvice: '',
        vetRequired: false,
      };
    }

    res.json({ result });
  } catch (error) {
    console.error('Dairy error:', error);
    res.status(500).json({ error: error.message || 'Dairy advisory failed' });
  }
});

module.exports = router;