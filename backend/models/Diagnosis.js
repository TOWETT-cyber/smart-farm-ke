const mongoose = require('mongoose');

const DiagnosisSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  cropType: { type: String },
  language: { type: String, default: 'en' },
  result: {
    diseaseName: String,
    severity: String,
    cause: String,
    treatment: [String],
    prevention: [String],
    rawText: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Diagnosis', DiagnosisSchema);