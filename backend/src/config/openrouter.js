const { OpenAI } = require('openai');
require('dotenv').config();

if (!process.env.OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY is not configured in backend/.env file.');
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/google/antigravity',
    'X-Title': 'AI Shloka Carousel Studio',
  }
});

module.exports = openai;
