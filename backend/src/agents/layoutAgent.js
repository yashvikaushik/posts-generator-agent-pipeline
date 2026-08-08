const BaseAgent = require('./BaseAgent');

class LayoutAgent extends BaseAgent {
  constructor() {
    // Uses the dynamic system prompt loaded from agent-7-layout-designer/README.md
    super('Layout Designer', 'agent-7-layout-designer');
  }

  async generateLayoutSpec(copyDeck, creativeBrief, promptPack) {
    const inputContent = `
    Carousel Copy Deck:
    ${JSON.stringify(copyDeck, null, 2)}

    Creative Direction Brief:
    ${creativeBrief}

    Image Prompt Pack:
    ${JSON.stringify(promptPack, null, 2)}
    `;

    // This agent outputs the final layout specification (Markdown format), so jsonMode is false
    return await this.execute(inputContent, false);
  }
}

module.exports = new LayoutAgent();
