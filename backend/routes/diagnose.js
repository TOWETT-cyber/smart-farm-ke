const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

const prompts = {
  en: `You are an expert agricultural assistant helping farmers in Kenya.
Analyze this crop image and respond in JSON ONLY:
{
  "diseaseName": "Name of disease or 'Healthy'",
  "severity": "Mild | Moderate | Severe | Healthy",
  "cause": "Brief cause explanation",
  "treatment": ["Step 1", "Step 2", "Step 3"],
  "prevention": ["Tip 1", "Tip 2", "Tip 3"]
}
Use simple language. Recommend affordable local solutions.`,
  sw: `Wewe ni mtaalamu wa kilimo unayesaidia wakulima Kenya.
Chunguza picha hii na ujibu KWA JSON TU:
{
  "diseaseName": "Jina la ugonjwa au 'Afya Njema'",
  "severity": "Kidogo | Wastani | Kali | Afya Njema",
  "cause": "Maelezo mafupi ya sababu",
  "treatment": ["Hatua 1", "Hatua 2", "Hatua 3"],
  "prevention": ["Ushauri 1", "Ushauri 2", "Ushauri 3"]
}`
};

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { cropType, language = 'en' } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = prompts[language] || prompts.en;
    const result = await model.generateContent([prompt, imagePart]);
    const rawText = result.response.text();

    let diagnosis;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      diagnosis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        diseaseName: 'Analysis complete',
        severity: 'Unknown',
        cause: rawText,
        treatment: [],
        prevention: []
      };
    } catch {
      diagnosis = {
        diseaseName: 'Analysis complete',
        severity: 'Unknown',
        cause: rawText,
        treatment: [],
        prevention: []
      };
    }

    res.json({ result: diagnosis });
  } catch (error) {
    console.error('Diagnose error:', error);
    res.status(500).json({ error: error.message || 'Diagnosis failed' });
  }
});

module.exports = router;
