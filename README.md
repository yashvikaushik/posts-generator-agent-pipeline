# 🕉️ Shruti Sadhana AI Studio — Posts Generator Agent Pipeline

> An autonomous multi-agent pipeline that transforms timeless Sanskrit wisdom, philosophy, and cultural concepts into high-engagement, publication-ready visual carousel posts for Instagram and LinkedIn.

---

## 📌 Project Overview & Current State

The **Posts Generator Agent Pipeline** is an end-to-end full-stack AI platform built with a modular Node.js/Express backend and a reactive Vite-React frontend. It orchestrates a sequential chain of specialized autonomous agents to research, structure, write, visually direct, and compose 4-slide social media carousels.

```
[ User Topic Input ]
         │
         ▼
┌────────────────────────────────────────────────────────┐
│               TEXTUAL AGENT PIPELINE                   │
│                                                        │
│  [1. Research Agent]    → Sanskrit & Context Extraction│
│          │                                             │
│          ▼                                             │
│  [2. Narrative Agent]   → Emotional Hook & Arc         │
│          │                                             │
│          ▼                                             │
│  [3. Planner Agent]     → Slide-by-Slide Outline       │
│          │                                             │
│          ▼                                             │
│  [4. Writer Agent]      → Structured JSON Copy Deck    │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│               CREATIVE & VISUAL PIPELINE               │
│                                                        │
│  [5. Creative Director] → Mood, Palette & Lighting     │
│          │                                             │
│          ▼                                             │
│  [6. Image Director]    → AI Visual Prompt Generation  │
│          │                                             │
│          ▼                                             │
│  [7. Layout Designer]   → Typography & Slide Placement │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
[ Real-Time Review Studio & Slide Canvas ]
```

---

## 🚀 What Is Happening in the Project As of Now

1. **Textual Agents are Fully Operational & Validated**:
   - The first four sequential text agents (**Research**, **Narrative Architect**, **Carousel Planner**, and **Carousel Writer**) are working reliably.
   - Text generation consistently produces accurate Shloka translations, relatable modern hooks, clear slide breakdowns, and clean structured JSON copy decks without hallucinations.

2. **Step-by-Step Execution & Caching**:
   - The backend includes a disk-based caching layer (`cacheManager.js`) that persists intermediate agent outputs.
   - Developers can run missions step-by-step, inspect intermediate outputs via modals in the UI, and resume generation without re-running previous steps or wasting API credits.

3. **Full-Duplex Real-Time Streaming**:
   - Client and server communicate over **Socket.IO** rooms (`MSN-<timestamp>`).
   - The UI displays live progress bars, granular execution logs, active agent indicators, and output inspection modals.

4. **Review Studio & Interactive Editor**:
   - Generated slide content (titles, body copy, hashtags, captions) renders directly in the React frontend editor for live adjustments.

---

## 🤖 Active AI Models & Configuration (Post-Testing)

After extensive experimentation with multiple providers (OpenAI, OpenRouter, Groq, and Google Gemini), the project is standardized on the following configuration:

| Component | Active Model / Provider | SDK / Endpoint | Role & Justification |
| :--- | :--- | :--- | :--- |
| **Primary Text Pipeline** | **`gemini-2.5-flash` / `gemini-3.5-flash`** | `@google/genai` (Google GenAI SDK) | Default model across all textual agents. Provides low latency, strong multilingual & Sanskrit comprehension, high reasoning accuracy, and native JSON mode support. |
| **Multi-Provider Fallback** | **Groq** & **OpenRouter** (`openai/gpt-oss-20b`, `llama-3-70b`) | `openai` SDK wrapper | Configured inside `BaseAgent.js` with dynamic routing for high-concurrency or alternative open-weight models. |
| **Temperature Anchoring** | `0.2` (Low temperature) | N/A | Kept low across textual agents to strictly enforce factual accuracy on sacred Sanskrit verses and prevent deity/thematic drift. |
| **Active Image Provider** | **Pollinations.ai** / Dynamic Prompt API | `https://image.pollinations.ai/prompt/...` | Initial image generator for generating 1024x1280 carousel visual assets. |

---

## 🎨 Next Milestone Focus: Image Generation & Visual Synthesis

> [!IMPORTANT]
> **Current Milestone Focus**: With the textual agent pipeline rock solid, active development is now centered on **Milestone 3 — Image Generation & Visual Synthesis**.

### Immediate Objectives for Image Generation:
- [ ] **Prompt Engineering Refinement**: Improve the **Image Prompt Director Agent** to enforce visual consistency (character style, color grading, lighting, and negative space for text overlays) across all 4 slides.
- [ ] **Image Aspect Ratio & Resolution Tuning**: Ensure full support for 1024x1280 (4:5 vertical carousel portrait format) tailored for Instagram/LinkedIn feeds.
- [ ] **Multi-Backend Image Generation**: Add modular image generation adapters supporting:
  - Pollinations.ai (Free / Quick prototyping)
  - OpenAI DALL-E 3
  - FLUX.1 / Stable Diffusion via Replicate/OpenRouter
- [ ] **Automated Graphic Composition**: Combine generated background artwork with typography overlays generated by the **Layout Designer Agent**.

---

## 📂 Project Architecture & Directory Structure

```text
posts-generator-agent-pipeline/
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── BaseAgent.js          # Abstract base class with multi-provider routing
│   │   │   ├── researchAgent.js      # Agent 1: Sanskrit topic & shloka researcher
│   │   │   ├── narrativeAgent.js     # Agent 2: Emotional hook & story architect
│   │   │   ├── plannerAgent.js       # Agent 3: 4-slide structure planner
│   │   │   ├── writerAgent.js        # Agent 4: Structured JSON copy writer
│   │   │   ├── creativeAgent.js      # Agent 5: Mood & aesthetic director
│   │   │   ├── imageAgent.js         # Agent 6: Visual prompt creator & image generator
│   │   │   └── layoutAgent.js        # Agent 7: CSS & layout designer
│   │   ├── config/
│   │   │   ├── gemini.js             # Google GenAI client instance
│   │   │   ├── groq.js               # Groq API client instance
│   │   │   └── openrouter.js         # OpenRouter API client instance
│   │   ├── services/
│   │   │   ├── cacheManager.js       # File-based step caching service
│   │   │   └── missionManager.js     # Sequential pipeline orchestrator
│   │   └── server.js                 # Express & Socket.io server entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # Mission Hub, Control Room, and Review Studio UI
│   │   ├── index.css                 # Dark-mode glassmorphism styling
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── docs/
    ├── architecture_and_flow.md      # Detailed system flow
    ├── milestone_tracker_notes.md    # Milestones & learning notes
    └── project_status.md             # In-depth architectural report
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **API Keys**: At least one valid API key for Gemini (required for default execution).

### 2. Environment Setup
Create a `.env` file inside the `backend/` directory:

```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here          # Optional: For Groq fallback
OPENROUTER_API_KEY=your_openrouter_key_here  # Optional: For OpenRouter fallback
```

### 3. Install Dependencies & Run

#### Backend Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5001
```

#### Frontend Client
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🧑‍💻 Git Branching Strategy

- **`main`**: Current default branch representing the integrated codebase (Milestones 1, 2, and active Milestone 3).
- **`milestone-1-skeleton`**: Milestone 1 foundational slice (Express + React + Mock Sockets).
- **`milestone-2-content-generation`**: Milestone 2 slice (Sanskrit & Carousel textual agents).
- **`milestone-3-image-generation`**: Milestone 3 slice (Creative, Image Director, and visual layout generation).

---

## 📜 License
This project is developed as part of the Full Stack Development Capstone Portfolio.
