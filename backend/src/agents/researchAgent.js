const BaseAgent = require('./BaseAgent');

class SanskritResearchAgent extends BaseAgent {
  constructor() {
    super('Sanskrit Researcher', 'agent-1-sanskrit-research');
  }

  async generateResearch(topic) {
    const anchoredInput = `
    Focus Topic: ${topic}
    
    `
    
    // Execute at temperature 0.1 for maximum factual accuracy
    return await this.execute(anchoredInput, false, 0.1);
  }
}

module.exports = new SanskritResearchAgent();
