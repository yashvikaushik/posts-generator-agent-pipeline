const BaseAgent = require('./BaseAgent');

class CarouselPlannerAgent extends BaseAgent {
  constructor() {
    super('Carousel Planner', 'agent-3-carousel-planner');
  }

  async generatePlan(narrativeBlueprint) {
    // This agent reads the narrative and maps it to a slide structure plan (Markdown format)
    return await this.execute(`Narrative Blueprint:\n${narrativeBlueprint}`, false);
  }
}

module.exports = new CarouselPlannerAgent();
