const researchAgent = require('../agents/researchAgent');
const narrativeAgent = require('../agents/narrativeAgent');
const plannerAgent = require('../agents/plannerAgent');
const writerAgent = require('../agents/writerAgent');

/**
 * Runs the active, text-based multi-agent sequential pipeline.
 * @param {string} missionId - The unique ID of the mission.
 * @param {string} topic - The topic to generate content for.
 * @param {string} platform - The target social platform.
 * @param {object} io - The Socket.io instance to broadcast events.
 * @param {object} activeMissions - The shared registry to store states.
 */
async function runActualMission(missionId, topic, platform, io, activeMissions) {
  try {
    console.log(`[MissionManager] Initializing pipeline for mission: ${missionId}`);
    
    activeMissions[missionId] = {
      id: missionId,
      topic,
      platform,
      status: 'Running',
      progress: 0,
      currentAgentIndex: 0,
      logs: [],
      slides: [],
      agentOutputs: {} // Store individual outputs here
    };
    const mission = activeMissions[missionId];

    // ==========================================
    // 1. Sanskrit Research Agent (0% -> 25%)
    // ==========================================
    mission.currentAgentIndex = 0;
    io.to(missionId).emit('agent-start', { agentIndex: 0, agentName: 'Research Agent' });
    io.to(missionId).emit('mission-log', { log: '[Research Agent] Researching scriptures...', progress: 10 });
    
    const researchOutput = await researchAgent.generateResearch(topic);
    mission.agentOutputs[0] = researchOutput;
    mission.logs.push('[Research Agent] Scriptural research compiled successfully.');
    
    io.to(missionId).emit('mission-log', { log: '[Research Agent] Done compiling Knowledge Brief.', progress: 25 });
    io.to(missionId).emit('agent-complete', { agentIndex: 0, agentName: 'Research Agent', output: researchOutput });

    // ==========================================
    // 2. Narrative Architect Agent (25% -> 50%)
    // ==========================================
    mission.currentAgentIndex = 1;
    io.to(missionId).emit('agent-start', { agentIndex: 1, agentName: 'Narrative Architect' });
    io.to(missionId).emit('mission-log', { log: '[Narrative Architect] Designing story outline...', progress: 35 });
    
    const narrativeOutput = await narrativeAgent.generateNarrative(researchOutput);
    mission.agentOutputs[1] = narrativeOutput;
    mission.logs.push('[Narrative Architect] Narrative arc outlined.');
    
    io.to(missionId).emit('mission-log', { log: '[Narrative Architect] Narrative Blueprint completed.', progress: 50 });
    io.to(missionId).emit('agent-complete', { agentIndex: 1, agentName: 'Narrative Architect', output: narrativeOutput });

    // ==========================================
    // 3. Carousel Planner Agent (50% -> 75%)
    // ==========================================
    mission.currentAgentIndex = 2;
    io.to(missionId).emit('agent-start', { agentIndex: 2, agentName: 'Carousel Planner' });
    io.to(missionId).emit('mission-log', { log: '[Carousel Planner] Mapping narrative to slides...', progress: 60 });
    
    const planOutput = await plannerAgent.generatePlan(narrativeOutput);
    mission.agentOutputs[2] = planOutput;
    mission.logs.push('[Carousel Planner] Slide structure planned.');
    
    io.to(missionId).emit('mission-log', { log: '[Carousel Planner] Slide-by-slide storyboard drafted.', progress: 75 });
    io.to(missionId).emit('agent-complete', { agentIndex: 2, agentName: 'Carousel Planner', output: planOutput });

    // ==========================================
    // 4. Carousel Writer Agent (75% -> 100%)
    // ==========================================
    mission.currentAgentIndex = 3;
    io.to(missionId).emit('agent-start', { agentIndex: 3, agentName: 'Carousel Writer' });
    io.to(missionId).emit('mission-log', { log: '[Carousel Writer] Drafting copy deck in structured format...', progress: 85 });
    
    const copyDeck = await writerAgent.generateCopy(planOutput);
    mission.agentOutputs[3] = copyDeck;
    mission.logs.push('[Carousel Writer] Finished copywriting slides and caption.');
    
    // Attach details from JSON response
    mission.caption = copyDeck.caption;
    mission.hashtags = copyDeck.hashtags;
    
    // Attach slide text + placeholder images (Visual agents 5-7 will fill these in Milestone 3)
    mission.slides = copyDeck.slides.map((slide, idx) => ({
      title: slide.title,
      body: slide.body,
      // Generic placeholder image so Milestone 2 remains fully renderable and testable!
      image: `https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80`
    }));

    io.to(missionId).emit('mission-log', { log: '[Carousel Writer] Completed slide writing.', progress: 100 });
    io.to(missionId).emit('agent-complete', { agentIndex: 3, agentName: 'Carousel Writer', output: copyDeck });

    // Finish Mission
    mission.status = 'Completed';
    mission.progress = 100;
    io.to(missionId).emit('mission-complete', mission);
    console.log(`[MissionManager] Mission ${missionId} finished successfully.`);

  } catch (error) {
    console.error(`[MissionManager] Mission ${missionId} failed:`, error);
    if (activeMissions[missionId]) {
      activeMissions[missionId].status = 'Failed';
    }
    io.to(missionId).emit('mission-log', { log: `❌ Error: ${error.message}`, progress: 100 });
  }
}

module.exports = { runActualMission };
