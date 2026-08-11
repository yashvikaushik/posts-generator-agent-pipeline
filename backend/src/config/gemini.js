const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Ensure the API key exists
if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not configured in backend/.env file.');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

module.exports = ai;
