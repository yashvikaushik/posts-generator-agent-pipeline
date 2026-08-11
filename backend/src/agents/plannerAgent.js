const BaseAgent = require('./BaseAgent');

class CarouselPlannerAgent extends BaseAgent {
  constructor() {
    super('Carousel Planner', 'agent-3-carousel-planner');
  }

  async generatePlan(narrativeBlueprint, knowledgeBrief) {

    console.log("AGENT 1 OUTPUT:");
    console.log(knowledgeBrief);

    console.log("AGENT 2 OUTPUT:");
    console.log(narrativeBlueprint);

    const inputContent = `
    INSTRUCTION: You are the Carousel Execution Planner. You must plan the slides based STRICTLY on the Narrative Blueprint and Reference Knowledge Brief below. 
    Do NOT introduce any external deities, names, or scriptures (for example, do NOT mention Chamunda or other deities if they are not explicitly present in the Narrative Blueprint). 
    Your entire plan must focus exclusively on the specific details, names (like Lalita Tripurasundari), and Sanskrit verses provided in the inputs below.

    Narrative Blueprint (Authoritative Story Arc):
    ${narrativeBlueprint}

    Reference Knowledge Brief (Factual Scripture & Translation):
    ${knowledgeBrief}
    `;

    console.log("========== EXACT AGENT 3 USER PROMPT ==========");
    console.log(inputContent);
    return await this.execute(inputContent, false, 0.1);
  }
}

module.exports = new CarouselPlannerAgent();
