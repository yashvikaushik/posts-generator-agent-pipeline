const { OpenAI } = require('openai');
require('dotenv').config();

if (!process.env.GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY is not configured in backend/.env file.');
}

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || ''
});

module.exports = groq;
