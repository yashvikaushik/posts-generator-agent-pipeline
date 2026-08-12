const researchAgent = require('../agents/researchAgent');
const narrativeAgent = require('../agents/narrativeAgent');
const plannerAgent = require('../agents/plannerAgent');
const writerAgent = require('../agents/writerAgent');
const creativeAgent = require('../agents/creativeAgent');
const imageAgent = require('../agents/imageAgent');
const layoutAgent = require('../agents/layoutAgent');
const { getMissionCache, saveAgentOutputToCache } = require('./cacheManager');

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

    // Load existing cache for this mission
    const cache = getMissionCache(missionId);

    // ==========================================
    // 1. Sanskrit Research Agent (0% -> 14%)
    // ==========================================
    mission.currentAgentIndex = 0;
    io.to(missionId).emit('agent-start', { agentIndex: 0, agentName: 'Research Agent' });
    io.to(missionId).emit('mission-log', { log: '[Research Agent] Analyzing scripture references...', progress: 5 });
    
    let researchOutput;
    if (cache[0]) {
      console.log(`[MissionManager] Loaded Agent 0 output from cache.`);
      researchOutput = cache[0];
    } else {
      researchOutput = await researchAgent.generateResearch(topic);
      saveAgentOutputToCache(missionId, 0, researchOutput);
    }
    
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
    
    let narrativeOutput;
    if (cache[1]) {
      console.log(`[MissionManager] Loaded Agent 1 output from cache.`);
      narrativeOutput = cache[1];
    } else {
      narrativeOutput = await narrativeAgent.generateNarrative(researchOutput);
      saveAgentOutputToCache(missionId, 1, narrativeOutput);
    }
    
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
    
    let planOutput;
    if (cache[2]) {
      console.log(`[MissionManager] Loaded Agent 2 output from cache.`);
      planOutput = cache[2];
    } else {
      planOutput = await plannerAgent.generatePlan(narrativeOutput, researchOutput);
      saveAgentOutputToCache(missionId, 2, planOutput);
    }
    
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
    
    let copyDeck;
    if (cache[3]) {
      console.log(`[MissionManager] Loaded Agent 3 output from cache.`);
      copyDeck = cache[3];
    } else {
      copyDeck = await writerAgent.generateCopy(planOutput);
      saveAgentOutputToCache(missionId, 3, copyDeck);
    }
    
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
    
    let creativeBrief;
    if (cache[4]) {
      console.log(`[MissionManager] Loaded Agent 4 output from cache.`);
      creativeBrief = cache[4];
    } else {
      creativeBrief = await creativeAgent.generateCreativeBrief(copyDeck, planOutput);
      saveAgentOutputToCache(missionId, 4, creativeBrief);
    }
    
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
    
    let imageResults;
    if (cache[5]) {
      console.log(`[MissionManager] Loaded Agent 5 output from cache.`);
      imageResults = cache[5];
    } else {
      imageResults = await imageAgent.generateImages(creativeBrief, copyDeck);
      saveAgentOutputToCache(missionId, 5, imageResults);
    }
    
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
    
    let layoutSpec;
    if (cache[6]) {
      console.log(`[MissionManager] Loaded Agent 6 output from cache.`);
      layoutSpec = cache[6];
    } else {
      layoutSpec = await layoutAgent.generateLayoutSpec(copyDeck, creativeBrief, imageResults.promptPack);
      saveAgentOutputToCache(missionId, 6, layoutSpec);
    }
    
    mission.agentOutputs[6] = layoutSpec;
    mission.logs.push('[Layout Designer] Final publication layout spec completed.');

    // Map slides together with their respective generated images
    mission.slides = copyDeck.slides.map((slide, idx) => ({
      title: slide.title,
      body: slide.body,
      image: imageResults.imageUrls[idx] 
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

/**
 * Runs a single agent step manually.
 */
async function runSingleAgentStep(missionId, agentIndex, topic, platform, io, activeMissions) {
  const cache = getMissionCache(missionId);
  
  if (!activeMissions[missionId]) {
    activeMissions[missionId] = {
      id: missionId,
      topic,
      platform,
      status: 'Running',
      progress: 0,
      currentAgentIndex: agentIndex,
      logs: [],
      slides: [],
      agentOutputs: {}
    };
  }
  const mission = activeMissions[missionId];
  mission.currentAgentIndex = agentIndex;

  let output;
  switch (Number(agentIndex)) {
    case 0:
      console.log(`[MissionManager] Manually running Agent 0 (Research Agent) for mission ${missionId}...`);
      io.to(missionId).emit('agent-start', { agentIndex: 0, agentName: 'Research Agent' });
      output = await researchAgent.generateResearch(topic);
      break;
    case 1:
      console.log(`[MissionManager] Manually running Agent 1 (Narrative Architect) for mission ${missionId}...`);
      io.to(missionId).emit('agent-start', { agentIndex: 1, agentName: 'Narrative Architect' });
      if (!cache[0]) throw new Error('Missing input from Agent 0 (Scriptural Research)');
      output = await narrativeAgent.generateNarrative(cache[0]);
      break;
    case 2:
      console.log(`[MissionManager] Manually running Agent 2 (Carousel Planner) for mission ${missionId}...`);
      io.to(missionId).emit('agent-start', { agentIndex: 2, agentName: 'Carousel Planner' });
      if (!cache[0] || !cache[1]) throw new Error('Missing input from Agent 0 or Agent 1');
      output = await plannerAgent.generatePlan(cache[1], cache[0]);
      break;
    case 3:
      console.log(`[MissionManager] Manually running Agent 3 (Carousel Writer) for mission ${missionId}...`);
      io.to(missionId).emit('agent-start', { agentIndex: 3, agentName: 'Carousel Writer' });
      if (!cache[2]) throw new Error('Missing input from Agent 2 (Storyboard Plan)');
      output = await writerAgent.generateCopy(cache[2]);
      break;
    case 4:
      console.log(`[MissionManager] Manually running Agent 4 (Creative Director) for mission ${missionId}...`);
      io.to(missionId).emit('agent-start', { agentIndex: 4, agentName: 'Creative Director' });
      if (!cache[3] || !cache[2]) throw new Error('Missing input from Agent 3 or Agent 2');
      output = await creativeAgent.generateCreativeBrief(cache[3], cache[2]);
      break;
    case 5:
      console.log(`[MissionManager] Manually running Agent 5 (Image Prompt Director) for mission ${missionId}...`);
      io.to(missionId).emit('agent-start', { agentIndex: 5, agentName: 'Image Prompt Director' });
      if (!cache[4] || !cache[3]) throw new Error('Missing input from Agent 4 or Agent 3');
      output = await imageAgent.generateImages(cache[4], cache[3]);
      break;
    case 6:
      console.log(`[MissionManager] Manually running Agent 6 (Layout Designer) for mission ${missionId}...`);
      io.to(missionId).emit('agent-start', { agentIndex: 6, agentName: 'Layout Designer' });
      if (!cache[3] || !cache[4] || !cache[5]) throw new Error('Missing input from Agent 3, 4, or 5');
      const promptPack = cache[5].promptPack || cache[5];
      output = await layoutAgent.generateLayoutSpec(cache[3], cache[4], promptPack);
      
      // Update slides and map them with images
      mission.slides = cache[3].slides.map((slide, idx) => ({
        title: slide.title,
        body: slide.body,
        image: cache[5].imageUrls ? cache[5].imageUrls[idx] : ''
      }));
      break;
    default:
      throw new Error(`Invalid agentIndex: ${agentIndex}`);
  }

  // Save output to cache
  saveAgentOutputToCache(missionId, agentIndex, output);
  
  // Update state and notify sockets
  mission.agentOutputs[agentIndex] = output;
  io.to(missionId).emit('agent-complete', { agentIndex, output });
  
  return output;
}

module.exports = { runActualMission, runSingleAgentStep };
