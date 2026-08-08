const { OpenAI } = require('openai');
require('dotenv').config();

// Ensure the API key exists
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
  console.warn('Warning: OPENAI_API_KEY is not configured in backend/.env file.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = openai;
