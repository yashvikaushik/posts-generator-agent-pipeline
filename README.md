# 📜 Milestone 2: Content Generation Slice — Posts Generator Agent Pipeline

> **Branch:** `milestone-2-content-generation`  
> **Status:** ✅ Completed

---

## 📌 Milestone Overview

The goal of **Milestone 2 (Content Generation Slice)** is to replace mock workers with a real, sequential multi-agent text generation pipeline.

In this milestone, four specialized AI agents work in sequence to translate Sanskrit philosophical themes into a cohesive, structured 4-slide social media copy deck rendered directly in the React frontend.

---

## 🤖 Sequential Agent Architecture

```
[ User Input Topic ]
         │
         ▼
┌────────────────────────────────────────────────────────┐
│ 1. Sanskrit Research Agent                             │
│    - Extracts relevant Sanskrit Shlokas & references   │
│    - Produces Reference Knowledge Brief (Markdown)     │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ 2. Narrative Architect Agent                           │
│    - Structures emotional hook & modern problem framing│
│    - Produces Narrative Blueprint (Markdown)           │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ 3. Carousel Planner Agent                              │
│    - Maps narrative into 4-slide visual breakdown      │
│    - Produces Carousel Outline (Markdown)              │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ 4. Carousel Writer Agent                               │
│    - Drafts precise slide titles, text, CTA & captions │
│    - Produces Structured JSON Deck                     │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
[ Real-Time Review Studio Canvas (React Frontend) ]
```

### 1. The Agents
- **`BaseAgent.js`**: Abstract parent class managing prompt loading from system prompt markdown templates and LLM execution.
- **`researchAgent.js` (Agent 1)**: Researches the chosen topic and provides core Sanskrit verses with literal translations.
- **`narrativeAgent.js` (Agent 2)**: Translates academic Sanskrit research into a compelling modern story arc and emotional hook.
- **`plannerAgent.js` (Agent 3)**: Divides the narrative into 4 distinct slide purposes (Hook, Context, Solution, CTA).
- **`writerAgent.js` (Agent 4)**: Writes the final copy with strict JSON formatting for direct client rendering.

### 2. Orchestration & Frontend Integration
- **`missionManager.js`**: Runs the sequential pipeline, handles error recovery, and broadcasts logs and percentages (25% → 50% → 75% → 100%) via Socket.IO.
- **Agent Output Modals**: Each agent's intermediate output is stored and emitted (`agent-complete`), enabling the frontend "👁️ View Output" inspector modal.
- **Review Studio**: Editable slide cards populate in real-time once the Writer Agent completes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- Valid API Key in `backend/.env`:
  ```env
  PORT=5001
  GEMINI_API_KEY=your_gemini_api_key_here
  # OR
  OPENAI_API_KEY=your_openai_api_key_here
  ```

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
# Server listening on http://localhost:5001
```

### 2. Start the Frontend Client
```bash
cd frontend
npm install
npm run dev
# Client running on http://localhost:5173
```

---

## 📋 Milestone Verification Checklist

- [x] Dynamic `BaseAgent` class implemented with system prompt loading.
- [x] 4 sequential textual agents implemented and chained.
- [x] Structured JSON mode validated for the Carousel Writer agent.
- [x] Orchestration in `missionManager.js` streaming progress over Socket.IO.
- [x] Intermediate agent outputs viewable via modal cards in React UI.
- [x] Real generated slide copy, caption, and hashtags populated in the Review Studio.
