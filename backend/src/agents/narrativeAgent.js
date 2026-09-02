const BaseAgent = require('./BaseAgent');

class NarrativeAgent extends BaseAgent {
  constructor() {
    super('Narrative Architect', 'agent-2-narrative-architect');
    this.model = 'openai/gpt-oss-20b';
  }

  async generateNarrative(knowledgeBrief) {
    // This agent reads the research and outputs structured narrative blueprint (Markdown format)
    return await this.execute(`Knowledge Brief:\n${knowledgeBrief}`, false);
  }
}

module.exports = new NarrativeAgent();
