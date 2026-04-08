const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const diagnoseRoute = require('./routes/diagnose');
const historyRoute = require('./routes/history');
const fertilizerRoute = require('./routes/fertilizer');
const weatherRoute = require('./routes/weather');
const dairyRoute = require('./routes/dairy');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/diagnose', diagnoseRoute);
app.use('/api/history', historyRoute);
app.use('/api/fertilizer', fertilizerRoute);
app.use('/api/weather', weatherRoute);
app.use('/api/dairy', dairyRoute);

app.get('/', (req, res) => res.json({ status: 'SMART FARM KE API running 🌾' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));