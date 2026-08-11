const BaseAgent = require('./BaseAgent');

class ImageAgent extends BaseAgent {
  constructor() {
    super('Image Prompt Director', 'agent-6-image-prompt-director');
  }

  async generateImages(creativeBrief, copyDeck) {

    // =========================================================
    // STEP 1: Generate 4 image prompts using the text model
    // =========================================================

    const jsonInstructions = `
CRITICAL INSTRUCTION:

You must convert the visual direction and slide copies into
4 standalone, descriptive image prompts.

Return your response strictly as a valid JSON object matching
this exact structure.

Do not output any markdown formatting before or after the JSON.

{
  "prompts": [
    "Descriptive prompt for Slide 1 background image",
    "Descriptive prompt for Slide 2 background image",
    "Descriptive prompt for Slide 3 background image",
    "Descriptive prompt for Slide 4 background image"
  ]
}

Each prompt must include:

- Premium magazine/editorial illustration style
- Visual subject
- Color palette
- Lighting
- Composition
- Negative-space requirements for text
- Texture/material treatment
- Consistent artistic identity across all four slides

Creative Direction Brief:
${creativeBrief}

Carousel Copy Deck:
${JSON.stringify(copyDeck, null, 2)}
`;

    console.log(
      '[Image Prompt Director] Generating visual prompt specs via Gemini...'
    );

    // BaseAgent -> OpenRouter text model
    const result = await this.execute(jsonInstructions, true);

    console.log(
      `[Image Prompt Director] Generated ${result.prompts.length} image prompts.`
    );

    // =========================================================
    // STEP 2: Generate images via free Pollinations.ai
    // =========================================================

    const imageUrls = [];

    for (let i = 0; i < result.prompts.length; i++) {
      const prompt = result.prompts[i];

      const cleanPrompt =
        prompt
          .replace(/[\n\r]/g, ' ')
          .substring(0, 350);

      const encodedPrompt =
        encodeURIComponent(
          `${cleanPrompt}, premium editorial educational illustration, digital painting`
        );

      const url =
        `https://image.pollinations.ai/prompt/${encodedPrompt}` +
        `?width=1024&height=1280&nologo=true&seed=${i}`;

      console.log(
        `[Image Prompt Director] Slide ${i + 1} Pollinations URL prepared.`
      );

      // Add image URL/data URI to array
      imageUrls.push(url);
    }

    // =========================================================
    // STEP 3: Debug output
    // =========================================================

    console.log(
      '========== FINAL IMAGE GENERATION OUTPUT ARRAY =========='
    );

    console.log(imageUrls);

    console.log(
      '========================================================='
    );

    // =========================================================
    // STEP 4: Return result to the mission pipeline
    // =========================================================

    return {
      promptPack: result,
      imageUrls
    };
  }
}

module.exports = new ImageAgent();