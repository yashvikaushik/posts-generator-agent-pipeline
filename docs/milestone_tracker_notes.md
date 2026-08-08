# Milestone Tracker, Diagrams, & Learning Notes

This living document tracks the architectural details, class structures, sequence lifecycles, and student learning notes as we progress through each milestone.

---

## 1. Class Diagram (OOP Agent Structure)

The system is designed around object-oriented principles. The specialized agents inherit from a single abstract base class (`BaseAgent`), minimizing code duplication.

```text
       +--------------------------------------------------------+
       |                       BaseAgent                        |
       +--------------------------------------------------------+
       | - name: string                                         |
       | - agentFolderName: string                              |
       | - systemPrompt: string                                 |
       +--------------------------------------------------------+
       | + constructor(name: string, folderName: string)        |
       | + loadPrompt(): void                                   |
       | + execute(userInput: string, jsonMode: bool): Promise  |
       +---------------------------+----------------------------+
                                   |
                                   | (Inherits / Extends)
         +-------------------------+-------------------------+
         |                         |                         |
         v                         v                         v
+------------------+      +------------------+      +------------------+
|  ResearchAgent   |      |  NarrativeAgent  |      |  PlannerAgent    | ... (Writer, etc.)
+------------------+      +------------------+      +------------------+
|                  |      |                  |      |                  |
+------------------+      +------------------+      +------------------+
| +generateResearch|      | +generateNarrative|     | +generatePlan    |
+------------------+      +------------------+      +------------------+
```

---

## 2. Sequence Diagram (Milestone 2 Pipeline Flow)

This sequence diagram details how output is passed from one agent to the next to build the copy deck.

```text
React Hub Form               Express server.js            MissionManager (Orchestrator)      OpenAI GPT API
      │                              │                                  │                            │
      ├─(1. POST /api/missions)─────>│                                  │                            │
      │                              ├─(2. Async Trigger)──────────────>│                            │
      │<─(3. Return 202 Mission ID)──┤                                  │                            │
      │                              │                                  ├─(4. Research Agent Run)───>│
      │                              │                                  │<─(5. Knowledge Brief)──────┤
      │<─(6. Socket: Log + 25%)──────┼──────────────────────────────────┤                            │
      │                              │                                  │                            │
      │                              │                                  ├─(7. Narrative Agent Run)──>│
      │                              │                                  │<─(8. Narrative Blueprint)──┤
      │<─(9. Socket: Log + 50%)──────┼──────────────────────────────────┤                            │
      │                              │                                  │                            │
      │                              │                                  ├─(10. Planner Agent Run)───>│
      │                              │                                  │<─(11. Carousel Plan)───────┤
      │<─(12. Socket: Log + 75%)─────┼──────────────────────────────────┤                            │
      │                              │                                  │                            │
      │                              │                                  ├─(13. Writer Agent JSON)───>│
      │                              │                                  │<─(14. JSON Slide Copy Deck)┤
      │<─(15. Socket: Log + 100%)────┼──────────────────────────────────┤                            │
      │                              │                                  │                            │
      │<─(16. Socket: Complete)──────┼──────────────────────────────────┤                            │
```

---

## 3. Learning Notes & Questions Log

### Q1: Why do we pass `io` and `activeMissions` into `runActualMission`?
*   **Answer:** Decoupling and Dependency Injection. If we created a new Socket instance or defined the global mission database inside `missionManager.js`, we would violate the **Single Responsibility Principle**. By passing them from `server.js` (which is the entry point owning the socket state), we ensure the orchestrator remains testable and stateless.

### Q2: Why are some agents run with `jsonMode: false` while the Writer uses `jsonMode: true`?
*   **Answer:**
    *   **Research, Narrative, and Planner (Markdown output):** These agents write natural summaries, tables, and outlines intended to give rich context to the next agents. They do not need to be parsed by code, only read by the next LLM call.
    *   **Carousel Writer (JSON output):** The writer produces the actual text that the React UI needs to display in editable form boxes. By outputting JSON, we can safely run `JSON.parse()` on the server and send the slide objects directly to the React state.

### Q3: How are individual agent outputs streamed and captured in the UI Control Room?
*   **Answer:** We updated `missionManager.js` to store each agent's output in the `agentOutputs` field of the mission object, and then emitted it with the `agent-complete` WebSocket event. On the client side, React captures these outputs in the `agentOutputs` state dictionary and activates the "View Output" button on each agent's status card. Clicking the button opens a Bootstrap-styled overlay modal showing the formatted output.

---

## 4. Current Milestone Status Tracker

*   [x] **Milestone 1: The Skeleton Slice**
    *   Completed infrastructure setup, mock sockets, basic styling, and app layouts.
*   [x] **Milestone 2: Content Generation Slice**
    *   [x] Step 2.1: OpenAI config and client setup.
    *   [x] Step 2.2: Dynamic `BaseAgent` parent class setup.
    *   [x] Step 2.3: Sanskrit Research Agent logic.
    *   [x] Step 2.4: Narrative Architect Agent logic.
    *   [x] Step 2.5: Carousel Planner Agent logic.
    *   [x] Step 2.6: Carousel Writer Agent logic (Structured JSON mode).
    *   [x] Step 2.7: Sequential Orchestration (`missionManager.js`).
    *   [x] Step 2.8: Hook up `MissionManager` inside `server.js` routes.
    *   [x] Step 2.9: Render real generated slide text outputs in React UI.
