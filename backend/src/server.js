const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend requests
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store active missions in-memory
const activeMissions = {};

// Sockets configuration
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-mission', (missionId) => {
    socket.join(missionId);
    console.log(`Socket ${socket.id} joined room: ${missionId}`);
    
    // If the mission exists and has logs, send them to catch the client up
    if (activeMissions[missionId]) {
      socket.emit('mission-history', activeMissions[missionId]);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Mock simulation of agent pipeline execution
async function runMockMission(missionId, topic, platform) {
  const agents = [
    { name: 'Sanskrit Research Agent', duration: 2500, messages: ['Analyzing shloka roots...', 'Searching Lalita Sahasranama commentaries...', 'Found translation: "Salutations to the Divine Mother..."'] },
    { name: 'Narrative Architect', duration: 2000, messages: ['Designing narrative theme...', 'Structuring core emotional story...', 'Establishing narrative arc: Seeking -> Connecting -> Realizing'] },
    { name: 'Carousel Planner', duration: 2000, messages: ['Structuring 3-slide outline...', 'Slide 1: Hook & Sanskrit verse...', 'Slide 2: Explanation & meaning...', 'Slide 3: Meditation call-to-action...'] },
    { name: 'Carousel Writer', duration: 3000, messages: ['Drafting English verses...', 'Writing slide captions...', 'Generating Instagram description...', 'Compiling hashtags: #LalitaSahasranama #SpiritualSeekers'] },
    { name: 'Creative Director', duration: 2000, messages: ['Determining color scheme...', 'Selecting fonts...', 'Setting visual mood: Devotional golden aura, soft gradients'] },
    { name: 'Image Prompt Director', duration: 3000, messages: ['Formulating DALL-E image prompt parameters...', 'Prompt 1: "Sleek glowing lotus inside golden temple..."', 'Triggering mock graphic assets...'] },
    { name: 'Layout Designer', duration: 2000, messages: ['Compiling layouts...', 'Overlaying text elements...', 'Packaging files...'] }
  ];

  activeMissions[missionId] = {
    id: missionId,
    topic,
    platform,
    status: 'Running',
    progress: 0,
    currentAgentIndex: 0,
    logs: [],
    slides: []
  };

  const mission = activeMissions[missionId];

  for (let i = 0; i < agents.length; i++) {
    mission.currentAgentIndex = i;
    const agent = agents[i];
    
    // Notify room of agent start
    io.to(missionId).emit('agent-start', {
      agentIndex: i,
      agentName: agent.name
    });

    for (const msg of agent.messages) {
      // Simulate typing/running latency
      await new Promise((resolve) => setTimeout(resolve, agent.duration / agent.messages.length));
      
      const logEntry = `[${agent.name}] ${msg}`;
      mission.logs.push(logEntry);
      
      // Emit log to UI
      io.to(missionId).emit('mission-log', {
        log: logEntry,
        progress: Math.round(((i + 1) / agents.length) * 100)
      });
    }

    // Agent complete
    io.to(missionId).emit('agent-complete', {
      agentIndex: i,
      agentName: agent.name
    });
  }

  // Populate mock final output data
  mission.status = 'Completed';
  mission.progress = 100;
  mission.slides = [
    { title: 'The Divine Within', body: 'The shloka describes the infinite conscious source of creation.', image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80' },
    { title: 'The Source of All', body: 'Meditation on Her form reveals inner calmness and clarity.', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=80' },
    { title: 'Connect & Realize', body: 'Feel Her presence. Meditate. Connect.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80' }
  ];
  mission.caption = `Meditate on the First Dhyana Shloka of Lalita Sahasranama. Let the divine conscious presence guide your thoughts. ✨\n\nRead the slides to dive deep into the meaning.`;
  mission.hashtags = `#LalitaSahasranama #Devi #Spirituality #Meditation #InnerPeace #SanatanaDharma`;

  io.to(missionId).emit('mission-complete', mission);
  console.log(`Mission ${missionId} completed successfully.`);
}

// REST Routes
app.post('/api/missions', (req, res) => {
  const { topic, platform } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  const missionId = `MSN-${Date.now()}`;
  
  // Start simulation asynchronously
  runMockMission(missionId, topic, platform || 'Instagram Carousel');

  res.status(202).json({
    message: 'Mission launched successfully.',
    missionId
  });
});

app.get('/api/missions/:id', (req, res) => {
  const mission = activeMissions[req.params.id];
  if (!mission) {
    return res.status(404).json({ error: 'Mission not found.' });
  }
  res.json(mission);
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Express Backend Server is running on port ${PORT}`);
});
