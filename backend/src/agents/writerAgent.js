const BaseAgent = require('./BaseAgent');

class CarouselWriterAgent extends BaseAgent {
  constructor() {
    super('Carousel Writer', 'agent-4-carousel-writer');
  }

  async generateCopy(carouselPlan) {
    // We append a JSON schema requirement to the prompt input so the OpenAI client returns structured data.
    const jsonInstructions = `
    
    CRITICAL INSTRUCTION: You must return your final Copy Deck strictly as a valid JSON object matching the following structure. Do not output any markdown formatting before or after the JSON.
    {
      "slides": [
        {
          "title": "Short Slide Title (Max 6-8 words)",
          "body": "Exact slide content (approx 30-50 words)"
        }
      ],
      "caption": "Instagram caption copy including emojis",
      "hashtags": "Space-separated hashtags"
    }
    
    Carousel Execution Plan input:
    ${carouselPlan}
    `;

    return await this.execute(jsonInstructions, true);
  }
}

module.exports = new CarouselWriterAgent();
