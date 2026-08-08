const fs = require('fs');
const path = require('path');
const openai = require('../config/openai');

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
   * Executes the agent's prompt using OpenAI GPT models.
   * @param {string} userInput - The input topic or previous agent's output.
   * @param {boolean} jsonMode - Set to true if this agent must output structured JSON data.
   * @returns {Promise<string|object>} - The completed content from GPT-4o.
   */
  async execute(userInput, jsonMode = false) {
    try {
      // Load the prompt if not already cached
      if (!this.systemPrompt) {
        this.loadPrompt();
      }

      console.log(`[${this.name}] Starting execution...`);
      
      const options = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.7
      };

      if (jsonMode) {
        options.response_format = { type: 'json_object' };
      }

      const response = await openai.chat.completions.create(options);
      const resultText = response.choices[0].message.content.trim();

      if (jsonMode) {
        return JSON.parse(resultText);
      }
      return resultText;
    } catch (error) {
      console.error(`Error in agent [${this.name}]:`, error);
      throw new Error(`Agent [${this.name}] execution failed: ${error.message}`);
    }
  }
}

module.exports = BaseAgent;
