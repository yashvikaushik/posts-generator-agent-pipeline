const BaseAgent = require('./BaseAgent');

class SanskritResearchAgent extends BaseAgent {
  constructor() {
    // Provide the agent name and its matching folder name in the ai-shloka-carousel repo
    super('Sanskrit Research Agent', 'agent-1-sanskrit-research');
  }

  async generateResearch(topic) {
    // Executes the dynamic system prompt loaded from agent-1-sanskrit-research/README.md
    return await this.execute(`Research Topic: ${topic}`, false);
  }
}

module.exports = new SanskritResearchAgent();
