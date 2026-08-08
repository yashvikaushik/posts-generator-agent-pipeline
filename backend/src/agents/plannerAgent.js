const BaseAgent = require('./BaseAgent');

class CarouselPlannerAgent extends BaseAgent {
  constructor() {
    super('Carousel Planner', 'agent-3-carousel-planner');
  }

  async generatePlan(narrativeBlueprint, knowledgeBrief) {
    const inputContent = `
    Narrative Blueprint (Authoritative Story Arc):
    ${narrativeBlueprint}

    Reference Knowledge Brief (Factual Scripture & Translation):
    ${knowledgeBrief}
    `;
    return await this.execute(inputContent, false);
  }
}

module.exports = new CarouselPlannerAgent();
