const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { runActualMission } = require('./services/missionManager');

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

// REST Routes
app.post('/api/missions', (req, res) => {
  const { topic, platform } = req.body;
  console.log("the topic is : ",topic);
  console.log("the platform is : ",platform);
  console.log("the data recieved is :",req.body)
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  const missionId = `MSN-${Date.now()}`;
  
  // Start actual mission asynchronously
  runActualMission(missionId, topic, platform || 'Instagram Carousel', io, activeMissions);

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Express Backend Server is running on port ${PORT}`);
});
