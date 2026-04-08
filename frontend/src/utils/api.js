import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const diagnoseImage = async (imageFile, cropType, language) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('cropType', cropType);
  formData.append('language', language);
  const response = await axios.post(`${API_BASE}/diagnose`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_BASE}/history`);
  return response.data;
};

export const getFertilizerAdvice = async (crop, soilColor, symptoms, language) => {
  const response = await axios.post(`${API_BASE}/fertilizer`, { crop, soilColor, symptoms, language });
  return response.data;
};

export const getWeatherAdvice = async (county, crop, language) => {
  const response = await axios.post(`${API_BASE}/weather`, { county, crop, language });
  return response.data;
};

export const getDairyAdvice = async (issue, animalType, symptoms, language) => {
  const response = await axios.post(`${API_BASE}/dairy`, { issue, animalType, symptoms, language });
  return response.data;
};