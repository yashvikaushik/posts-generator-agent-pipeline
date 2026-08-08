const BaseAgent = require('./BaseAgent');
const openai = require('../config/openai');

class ImageAgent extends BaseAgent {
  constructor() {
    // Uses the dynamic system prompt loaded from agent-6-image-prompt-director/README.md
    super('Image Prompt Director', 'agent-6-image-prompt-director');
  }

  async generateImages(creativeBrief, copyDeck) {
    const jsonInstructions = `
    
    CRITICAL INSTRUCTION: You must convert the visual direction and slide copies into 4 standalone, descriptive DALL-E 3 prompts. Return your response strictly as a valid JSON object matching this structure. Do not output any markdown formatting before or after the JSON.
    {
      "prompts": [
        "Descriptive DALL-E 3 prompt for Slide 1 background image (Premium Magazine illustration style, including colors, lighting, negative space guidelines)",
        "Descriptive DALL-E 3 prompt for Slide 2...",
        "Descriptive DALL-E 3 prompt for Slide 3...",
        "Descriptive DALL-E 3 prompt for Slide 4..."
      ]
    }

    Creative Direction Brief:
    ${creativeBrief}

    Carousel Copy Deck:
    ${JSON.stringify(copyDeck, null, 2)}
    `;

    console.log('[Image Prompt Director] Generating DALL-E prompt specs...');
    const result = await this.execute(jsonInstructions, true);
    
    const imageUrls = [];

    // Call DALL-E 3 API sequentially for each generated slide prompt
    for (let i = 0; i < result.prompts.length; i++) {
      const prompt = result.prompts[i];
      console.log(`[Image Prompt Director] Triggering DALL-E 3 image generation for Slide ${i + 1}...`);
      
      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        });
        
        imageUrls.push(response.data[0].url);
        console.log(`[Image Prompt Director] Slide ${i + 1} image generated successfully.`);
      } catch (err) {
        console.error(`[Image Prompt Director] Failed to generate DALL-E image for Slide ${i + 1}:`, err);
        // Fallback to a placeholder image if DALL-E fails (e.g. billing limit, content filters)
        imageUrls.push(`https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80`);
      }
    }

    return {
      promptPack: result,
      imageUrls: imageUrls
    };
  }
}

module.exports = new ImageAgent();
