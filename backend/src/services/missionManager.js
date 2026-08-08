const researchAgent = require('../agents/researchAgent');
const narrativeAgent = require('../agents/narrativeAgent');
const plannerAgent = require('../agents/plannerAgent');
const writerAgent = require('../agents/writerAgent');
const creativeAgent = require('../agents/creativeAgent');
const imageAgent = require('../agents/imageAgent');
const layoutAgent = require('../agents/layoutAgent');

/**
 * Runs the active, 7-agent sequential content pipeline.
 * @param {string} missionId - The unique ID of the mission.
 * @param {string} topic - The topic to generate content for.
 * @param {string} platform - The target social platform.
 * @param {object} io - The Socket.io instance to broadcast events.
 * @param {object} activeMissions - The shared registry to store states.
 */
async function runActualMission(missionId, topic, platform, io, activeMissions) {
  try {
    console.log(`[MissionManager] Initializing 7-agent pipeline for mission: ${missionId}`);
    
    activeMissions[missionId] = {
      id: missionId,
      topic,
      platform,
      status: 'Running',
      progress: 0,
      currentAgentIndex: 0,
      logs: [],
      slides: [],
      agentOutputs: {}
    };
    const mission = activeMissions[missionId];

    // ==========================================
    // 1. Sanskrit Research Agent (0% -> 14%)
    // ==========================================
    mission.currentAgentIndex = 0;
    io.to(missionId).emit('agent-start', { agentIndex: 0, agentName: 'Research Agent' });
    io.to(missionId).emit('mission-log', { log: '[Research Agent] Analyzing scripture references...', progress: 5 });
    
    const researchOutput = await researchAgent.generateResearch(topic);
    mission.agentOutputs[0] = researchOutput;
    mission.logs.push('[Research Agent] Scriptural research compiled successfully.');
    io.to(missionId).emit('mission-log', { log: '[Research Agent] Done compiling Knowledge Brief.', progress: 14 });
    io.to(missionId).emit('agent-complete', { agentIndex: 0, agentName: 'Research Agent', output: researchOutput });

    // ==========================================
    // 2. Narrative Architect Agent (14% -> 28%)
    // ==========================================
    mission.currentAgentIndex = 1;
    io.to(missionId).emit('agent-start', { agentIndex: 1, agentName: 'Narrative Architect' });
    io.to(missionId).emit('mission-log', { log: '[Narrative Architect] Structuring story logic...', progress: 20 });
    
    const narrativeOutput = await narrativeAgent.generateNarrative(researchOutput);
    mission.agentOutputs[1] = narrativeOutput;
    mission.logs.push('[Narrative Architect] Narrative arc outlined.');
    io.to(missionId).emit('mission-log', { log: '[Narrative Architect] Narrative Blueprint completed.', progress: 28 });
    io.to(missionId).emit('agent-complete', { agentIndex: 1, agentName: 'Narrative Architect', output: narrativeOutput });

    // ==========================================
    // 3. Carousel Planner Agent (28% -> 42%)
    // ==========================================
    mission.currentAgentIndex = 2;
    io.to(missionId).emit('agent-start', { agentIndex: 2, agentName: 'Carousel Planner' });
    io.to(missionId).emit('mission-log', { log: '[Carousel Planner] Outlining slides blueprints...', progress: 35 });
    
    const planOutput = await plannerAgent.generatePlan(narrativeOutput, researchOutput);
    mission.agentOutputs[2] = planOutput;
    mission.logs.push('[Carousel Planner] Slide layout structure planned.');
    io.to(missionId).emit('mission-log', { log: '[Carousel Planner] Storyboard drafted.', progress: 42 });
    io.to(missionId).emit('agent-complete', { agentIndex: 2, agentName: 'Carousel Planner', output: planOutput });

    // ==========================================
    // 4. Carousel Writer Agent (42% -> 57%)
    // ==========================================
    mission.currentAgentIndex = 3;
    io.to(missionId).emit('agent-start', { agentIndex: 3, agentName: 'Carousel Writer' });
    io.to(missionId).emit('mission-log', { log: '[Carousel Writer] Drafting copy deck slides...', progress: 50 });
    
    const copyDeck = await writerAgent.generateCopy(planOutput);
    mission.agentOutputs[3] = copyDeck;
    mission.caption = copyDeck.caption;
    mission.hashtags = copyDeck.hashtags;
    mission.logs.push('[Carousel Writer] Finished copywriting slides and caption.');
    io.to(missionId).emit('mission-log', { log: '[Carousel Writer] Slide copy deck successfully compiled.', progress: 57 });
    io.to(missionId).emit('agent-complete', { agentIndex: 3, agentName: 'Carousel Writer', output: copyDeck });

    // ==========================================
    // 5. Creative Director Agent (57% -> 71%)
    // ==========================================
    mission.currentAgentIndex = 4;
    io.to(missionId).emit('agent-start', { agentIndex: 4, agentName: 'Creative Director' });
    io.to(missionId).emit('mission-log', { log: '[Creative Director] Formulating overall artistic vision...', progress: 65 });
    
    const creativeBrief = await creativeAgent.generateCreativeBrief(copyDeck, planOutput);
    mission.agentOutputs[4] = creativeBrief;
    mission.logs.push('[Creative Director] Visual guidelines and typography philosophy outlined.');
    io.to(missionId).emit('mission-log', { log: '[Creative Director] Done drafting Creative Direction Brief.', progress: 71 });
    io.to(missionId).emit('agent-complete', { agentIndex: 4, agentName: 'Creative Director', output: creativeBrief });

    // ==========================================
    // 6. Image Prompt Director Agent (71% -> 85%)
    // ==========================================
    mission.currentAgentIndex = 5;
    io.to(missionId).emit('agent-start', { agentIndex: 5, agentName: 'Image Prompt Director' });
    io.to(missionId).emit('mission-log', { log: '[Image Prompt Director] Writing DALL-E prompts...', progress: 78 });
    
    const imageResults = await imageAgent.generateImages(creativeBrief, copyDeck);
    mission.agentOutputs[5] = imageResults.promptPack;
    mission.logs.push('[Image Prompt Director] Slide background graphics generated via DALL-E.');
    io.to(missionId).emit('mission-log', { log: '[Image Prompt Director] Image prompts and assets ready.', progress: 85 });
    io.to(missionId).emit('agent-complete', { agentIndex: 5, agentName: 'Image Prompt Director', output: imageResults.promptPack });

    // ==========================================
    // 7. Layout Designer Agent (85% -> 100%)
    // ==========================================
    mission.currentAgentIndex = 6;
    io.to(missionId).emit('agent-start', { agentIndex: 6, agentName: 'Layout Designer' });
    io.to(missionId).emit('mission-log', { log: '[Layout Designer] Compiling final slides structure...', progress: 92 });
    
    const layoutSpec = await layoutAgent.generateLayoutSpec(copyDeck, creativeBrief, imageResults.promptPack);
    mission.agentOutputs[6] = layoutSpec;
    mission.logs.push('[Layout Designer] Final publication layout spec completed.');

    // Map slides together with their respective DALL-E generated images
    mission.slides = copyDeck.slides.map((slide, idx) => ({
      title: slide.title,
      body: slide.body,
      image: imageResults.imageUrls[idx] || `https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80`
    }));

    io.to(missionId).emit('mission-log', { log: '[Layout Designer] All slide layouts fully constructed.', progress: 100 });
    io.to(missionId).emit('agent-complete', { agentIndex: 6, agentName: 'Layout Designer', output: layoutSpec });

    // Finalize Mission
    mission.status = 'Completed';
    mission.progress = 100;
    io.to(missionId).emit('mission-complete', mission);
    console.log(`[MissionManager] Mission ${missionId} finished successfully.`);

  } catch (error) {
    console.error(`[MissionManager] Pipeline error on ${missionId}:`, error);
    if (activeMissions[missionId]) {
      activeMissions[missionId].status = 'Failed';
    }
    io.to(missionId).emit('mission-log', { log: `❌ Pipeline Error: ${error.message}`, progress: 100 });
  }
}

module.exports = { runActualMission };
