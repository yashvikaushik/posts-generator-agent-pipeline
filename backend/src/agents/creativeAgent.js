const BaseAgent = require('./BaseAgent');

class CreativeAgent extends BaseAgent {
  constructor() {
    // Uses the dynamic system prompt loaded from agent-5-creative-director/README.md
    super('Creative Director', 'agent-5-creative-director');
  }

  async generateCreativeBrief(copyDeck, plan) {
    const inputContent = `
    Carousel Copy Deck:
    ${JSON.stringify(copyDeck, null, 2)}

    Carousel Execution Plan:
    ${plan}
    `;

    // This agent outputs a visual design spec guide (Markdown format), so jsonMode is false
    return await this.execute(inputContent, false);
  }
}

module.exports = new CreativeAgent();
