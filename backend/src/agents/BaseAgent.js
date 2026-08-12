const fs = require('fs');
const path = require('path');
const ai = require('../config/gemini');

class BaseAgent {
  /**
   * @param {string} name - Agent name
   * @param {string} agentFolderName - The folder name of the agent inside the sibling ai-shloka-carousel repo
   */
  constructor(name, agentFolderName) {
    this.name = name;
    this.agentFolderName = agentFolderName;
    this.systemPrompt = '';
  }

  /**
   * Reads the system prompt README.md file dynamically
   */
  loadPrompt() {
    try {
      // Navigate to the sibling 'AI agent /ai-shloka-carousel' directory
      const promptPath = path.join(
        __dirname,
        '../../../../AI agent /ai-shloka-carousel',
        this.agentFolderName,
        'README.md'
      );
      
      this.systemPrompt = fs.readFileSync(promptPath, 'utf8');
      console.log(`[${this.name}] Successfully loaded prompt from: ${this.agentFolderName}/README.md`);
    } catch (error) {
      console.error(`[${this.name}] Failed to load system prompt from folder ${this.agentFolderName}:`, error);
      throw new Error(`System prompt loading failed for ${this.name}`);
    }
  }

  /**
   * Executes the agent's prompt using Gemini SDK.
   * @param {string} userInput - The input topic or previous agent's output.
   * @param {boolean} jsonMode - Set to true if this agent must output structured JSON data.
   * @param {number} temperature - Controlling creativity/hallucinations (default 0.2)
   * @returns {Promise<string|object>} - The completed content from Gemini.
   */
  async execute(userInput, jsonMode = false, temperature = 0.2) {
    try {
      // Load the prompt if not already cached
      if (!this.systemPrompt) {
        this.loadPrompt();
      }

      console.log(`[${this.name}] Starting execution on gemini-2.5-flash with temperature ${temperature}...`);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${this.systemPrompt}\n\nUser Input:\n${userInput}` }] }
        ],
        config: {
          temperature: temperature,
          responseMimeType: jsonMode ? 'application/json' : 'text/plain'
        }
      });

      const text = response.text;

      if (jsonMode) {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error(`[${this.name}] Failed to parse JSON response:`, text);
          throw new Error('Agent failed to return a parseable JSON block');
        }
      }

      return text;
    } catch (error) {
      console.error(`[${this.name}] Error during execution:`, error);
      throw error;
    }
  }
}

module.exports = BaseAgent;
