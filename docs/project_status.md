# Project Status & Current Progress Report

This document provides a comprehensive overview of the current status of the **Posts Generator Agent Pipeline** (Shruti Sadhana AI Studio) project, including the models in use, system architecture, completed milestones, and run instructions.

---

## 1. Active AI Models Configuration

- **Text & Structure Generation**: The core sequential agents extend the abstract class [BaseAgent.js](file:///Users/yashvikaushik/Documents/Documents/codeCoach/FSD/capstone.projects/posts-generator-agent-pipeline/backend/src/agents/BaseAgent.js). It dynamically routes requests based on the designated `this.provider` and `this.model`:
  - **Gemini**: Default provider. (Model: `gemini-3.5-flash` or `gemini-2.5-flash`).
  - **OpenRouter**: Supported via `provider: 'openrouter'` or auto-detected if the model name includes a slash `/` (e.g. `openai/gpt-oss-20b`). Configured in [openrouter.js](file:///Users/yashvikaushik/Documents/Documents/codeCoach/FSD/capstone.projects/posts-generator-agent-pipeline/backend/src/config/openrouter.js).
  - **Groq**: Supported via `provider: 'groq'`. Configured in [groq.js](file:///Users/yashvikaushik/Documents/Documents/codeCoach/FSD/capstone.projects/posts-generator-agent-pipeline/backend/src/config/groq.js) (requires `GROQ_API_KEY` in `.env`).
  - **SDKs**: `@google/genai` (for Gemini) and standard `openai` wrapper (for OpenRouter & Groq).
- **Image Generation**: The [imageAgent.js](file:///Users/yashvikaushik/Documents/Documents/codeCoach/FSD/capstone.projects/posts-generator-agent-pipeline/backend/src/agents/imageAgent.js) generates visual prompts using the text model and translates them into free image assets via:
  - **API**: **Pollinations.ai** (`https://image.pollinations.ai/prompt/...`)
  - **Resolution**: 1024x1280 (optimised for Instagram Carousels)
  - **Aesthetics**: Premium editorial educational illustration digital painting style

### Coding Assistant Model (IDE Chat)
- The user is currently pair programming with the **Antigravity AI coding assistant**, which is configured with the **Gemini 3.5 Flash** model.

---

## 2. Completed Milestones & What Has Been Done

### Milestone 1: The Skeleton Slice (Infrastructure Setup)
- Established the base Express backend and Vite-React frontend folders.
- Integrated `socket.io` for full-duplex communication (real-time logging and status tracking).
- Implemented mock pipeline runs to verify client-server handshakes.

### Milestone 2: Content Generation Slice (Sanskrit & Carousel Agents)
- Configured dynamic system prompt loading from the sibling repository `/ai-shloka-carousel`.
- Implemented the core text agent architecture with `BaseAgent` and specialized instances:
  1. **Sanskrit Research Agent** (Topic research & Shloka extraction)
  2. **Narrative Architect Agent** (Emotional hook & thematic narrative blueprint)
  3. **Carousel Planner Agent** (Visual and text outline per slide)
  4. **Carousel Writer Agent** (Slide text & caption drafting, structured JSON mode output)
- Built the asynchronous orchestrator in `missionManager.js` to execute the pipeline and stream progress logs over WebSocket channels.
- Rended the real-time generated slide text in the React front-end editor.

### Milestone 3: Creative & Image Generation Slice
- Built three additional agents to handle creative layouts and graphics:
  5. **Creative Director Agent**: Drafts visual specifications (palette, mood, lighting).
  6. **Image Prompt Director Agent**: Combines copy/theme and coordinates Pollinations.ai image requests.
  7. **Layout Designer Agent**: Finalizes CSS layout constraints, typography pairings, and element alignment.
- Integrated the additional agents into `missionManager.js` and scaled the progress percentage appropriately.
- Updated the React UI ([App.jsx](file:///Users/yashvikaushik/Documents/Documents/codeCoach/FSD/capstone.projects/posts-generator-agent-pipeline/frontend/src/App.jsx)) to render DALL-E/Pollinations visual slides dynamically in the Review Studio.

---

## 3. System Architecture & Flow

### Backend Architecture
- **Server Entry**: [server.js](file:///Users/yashvikaushik/Documents/Documents/codeCoach/FSD/capstone.projects/posts-generator-agent-pipeline/backend/src/server.js) running Express and Socket.io.
- **REST Endpoints**:
  - `POST /api/missions`: Initiates a new background content generation mission.
  - `POST /api/missions/:id/run-step`: Runs a specific single agent step (for debugging).
  - `GET /api/missions/:id`: Checks current state/outputs of a mission.
- **WebSocket Room**: Client joins room `MSN-<timestamp>` to receive real-time status updates:
  - `agent-start` / `agent-complete`
  - `mission-log`
  - `mission-complete`

### Frontend UI (React + Vite)
- **Mission Hub**: Input parameters such as Topic, Platform, Tone.
- **Control Room**: Terminal output display matching logs from the backend agent pipeline, with a step-by-step progress checklist.
- **Review Studio**: Editable slide forms mapping directly to backend data, permitting direct title, text, and visual refinement.

---

## 4. Current Directory Map

```text
posts-generator-agent-pipeline/
├── backend/
│   ├── src/
│   │   ├── agents/            # Specialized agents (BaseAgent, Research, Narrative, etc.)
│   │   ├── config/            # Gemini & API configurations
│   │   ├── services/          # missionManager orchestrator
│   │   └── server.js          # Express and Socket.io main file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main view switcher and state controller
│   │   └── index.css          # Styling rules
│   ├── index.html
│   └── package.json
└── docs/                      # Architectural and student learning guides
    ├── architecture_and_flow.md
    ├── milestone_tracker_notes.md
    ├── project_status.md      # <-- THIS FILE
    ├── student_guide.md
    └── sturdy_system_guide.md
```
