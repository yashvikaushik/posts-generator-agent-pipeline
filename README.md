# 🎨 Milestone 3: Image Generation & Visual Synthesis — Posts Generator Agent Pipeline

> **Branch:** `milestone-3-image-generation`  
> **Status:** 🚧 **Active Development / Still Working (WIP)**

---

## 📌 Milestone Overview

With the core textual agent pipeline (Research, Narrative Architect, Carousel Planner, Carousel Writer) battle-tested and running reliably, **Milestone 3** focuses on the **Creative & Visual Generation Layer**.

This milestone extends the 4-agent textual pipeline into a 7-agent studio capable of generating creative direction, AI visual prompts, background art, and responsive slide layouts.

---

## 🤖 Extended 7-Agent Architecture

```
┌────────────────────────────────────────────────────────┐
│               TEXTUAL PIPELINE (COMPLETED)             │
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
│            VISUAL SYNTHESIS PIPELINE (IN PROGRESS)     │
│                                                        │
│  [5. Creative Director] → Mood, Palette & Lighting     │
│          │                                             │
│          ▼                                             │
│  [6. Image Director]    → AI Visual Prompts & Assets   │
│          │                                             │
│          ▼                                             │
│  [7. Layout Designer]   → Typography & CSS Positioning │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
[ Real-Time Review Studio Canvas (Text + Visual Slides) ]
```

---

## 🤖 Active AI Models & Configuration

After testing across multiple providers, the active configuration is:

- **Primary Textual & Prompt Engine**: **`gemini-2.5-flash` / `gemini-3.5-flash`** via `@google/genai`.
  - Chosen for fast inference speeds, high accuracy on Sanskrit texts, and strict JSON adherence.
  - Temperature set to `0.2` to prevent hallucinations and thematic drift.
- **Multi-Provider Fallback**: Dynamic provider routing implemented in `BaseAgent.js` for **Groq** and **OpenRouter** (`openai/gpt-oss-20b`, `llama-3-70b`).
- **Image Generation Engine (Current Prototype)**: **Pollinations.ai** dynamic prompt generation (1024x1280 resolution, editorial digital painting style).

---

## 🚧 Current Work-In-Progress & Objectives

- [x] Implemented Agent 5: Creative Director Agent (`creativeAgent.js`).
- [x] Implemented Agent 6: Image Prompt Director Agent (`imageAgent.js`).
- [x] Implemented Agent 7: Layout Designer Agent (`layoutAgent.js`).
- [x] Built step-by-step cache manager (`cacheManager.js`) and UI run buttons.
- [x] Updated React Review Studio to preview visual slides alongside text copy.
- [ ] **In Progress**: Tuning prompt consistency across 4 slides (unified color grading, lighting, and negative space for typography).
- [ ] **In Progress**: Evaluating multi-backend image generators (Pollinations, DALL-E 3, FLUX / Replicate).
- [ ] **In Progress**: Dynamic typography overlay composition based on Layout Agent outputs.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- Valid API Keys in `backend/.env`:
  ```env
  PORT=5001
  GEMINI_API_KEY=your_gemini_api_key_here
  GROQ_API_KEY=your_groq_api_key_here          # Optional
  OPENROUTER_API_KEY=your_openrouter_key_here  # Optional
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
