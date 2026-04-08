const express = require('express');
const router = express.Router();
const Diagnosis = require('../models/Diagnosis');

// Get recent 20 diagnoses
router.get('/', async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('imageUrl cropType result.diseaseName result.severity createdAt');
    res.json(diagnoses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get single diagnosis by ID
router.get('/:id', async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) return res.status(404).json({ error: 'Not found' });
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diagnosis' });
  }
});

module.exports = router;