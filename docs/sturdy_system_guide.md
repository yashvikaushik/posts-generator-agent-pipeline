# Sturdy System Guide: End-to-End Flow & Diagrams

This guide explains the end-to-end flow, sequence interactions, and component structures of the **Shruti Sadhana AI Studio** application.

---

## 1. End-to-End Flow (The Lifecycle of a Mission)

Here is a step-by-step description of what happens from the moment you click "Launch Mission":

1.  **Launch Request:** The user inputs the content parameters (Topic, Platform, Audience, Tone) in the React frontend (`MissionHub.jsx`) and submits the form.
2.  **API Trigger:** The React client sends a `POST /api/missions` request containing the parameters to the Express server.
3.  **Instant Handshake:** The server assigns a unique `missionId` (e.g., `MSN-1725890000000`), initializes an empty mission state in its memory registry, and immediately returns a `202 Accepted` status with the `missionId` to the browser. This prevents the HTTP request from timing out.
4.  **Worker Initiation:** Simultaneously, the server kicks off the sequential agent pipeline asynchronously in the background.
5.  **Room Subscription:** The React frontend receives the `missionId`, updates the active view to the **Control Room**, and establishes a WebSocket connection with the Socket.io server. The client automatically sends a `join-mission` event to register itself to that specific `missionId` room.
6.  **Sequential Run & Broadcast:** The background manager runs the 7 agents step-by-step:
    *   As each agent starts, runs, logs details, and completes, the backend publishes these updates to the socket room.
    *   The React client receives these live events and appends them to the console log stream and updates the visual status gauges.
7.  **Saving State:** Once the final Layout Designer (Agent 7) completes, the finalized slide copy, generated image URLs, and text caption results are saved inside the mission state on the server.
8.  **Completion & Load:** A `mission-complete` socket event is fired. The React frontend unlocks the **Review Studio** and loads the newly generated content into interactive forms.
9.  **User Modifications:** The user reviews the content, edits titles or bodies directly in React, and saves it.
10. **Export Packaging:** The user clicks "Export" in the **Export Center**. The backend compiles the finalized graphics and texts, packages them into a `.zip` file on the fly using `adm-zip`, and streams it down to the user's browser as a file download.

---

## 2. ASCII Component Diagram

This diagram shows how different code modules are layered and connected across the client-server boundary.

```text
+-------------------------------------------------------------------------------+
|                       [ LAYER 1: REACT FRONTEND (VITE) ]                      |
+-------------------------------------------------------------------------------+
|                                                                               |
|   +------------------+     +--------------------+     +-------------------+   |
|   |  MissionHub.jsx  |     |  ControlRoom.jsx   |     |  ReviewStudio.jsx |   |
|   |  (Forms & Config)|     |  (Live Console Log)|     |  (Inline Editor)  |   |
|   +--------+---------+     +---------^----------+     +---------+---------+   |
|            |                         │                          │             |
|  POST /api/missions                  │ Socket.io                │ PUT edits   |
|            │                         │ Events                   │             |
+------------┼─────────────────────────┼──────────────────────────┼-------------+
             │                         │                          │
             v                         │                          v
+------------┼─────────────────────────┼──────────────────────────┼-------------+
|            │         [ LAYER 2: EXPRESS.JS API BACKEND ]        │             |
+------------┼────────────────────────────────────────────────────┼-------------+
|            v                                                    v             |
|   +------------------+       +------------------+       +-----------------+   |
|   |  Mission Router  |       | Socket.io Server |       |  Review Router  |   |
|   | (Starts async)   |       | (Broadcasts logs)|       | (Updates data)  |   |
|   +--------+---------+       +--------^---------+       +-----------------+   |
|            │                          │                                       |
|            │ Triggers                 │ Publishes logs                        |
|            v                          │                                       |
|   +------------------+                │                                       |
|   | Pipeline Manager ├────────────────+                                       |
|   | (Orchestrator)   |                                                        |
|   +--------+---------+                                                        |
|            │                                                                  |
|            │ Sequential executions                                            |
|            v                                                                  |
+------------┼──────────────────────────────────────────────────────────────────+
             │
             v
+------------┼──────────────────────────────────────────────────────────────────+
|            │          [ LAYER 3: SEQUENTIAL AI AGENTS PIPELINE ]              |
+------------┼──────────────────────────────────────────────────────────────────+
|            │                                                                  |
|            ├──> Sanskrit Research Agent ─────> Queries Shloka translation     |
|            ├──> Narrative Architect Agent ───> Structures emotional theme     |
|            ├──> Carousel Planner Agent ──────> Designs slide layout flow      |
|            ├──> Carousel Writer Agent ───────> Drafts slide text & captions   |
|            ├──> Creative Director Agent ─────> Outlines visual style specs    |
|            ├──> Image Prompt Director ───────> Formulates DALL-E image prompts|
|            └──> Layout Designer Agent ───────> Arranges and wraps visual text |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 3. ASCII Sequence Diagram

This diagram outlines the sequential timeline of messages, actions, and socket notifications triggered throughout the application runtime.

```text
User           React Front (Vite)          Express Server (API)        Pipeline Orchestrator
 │                     │                            │                            │
 ├─(1. Setup topic)───>│                            │                            │
 │                     │                            │                            │
 ├─(2. Click Launch)──>│                            │                            │
 │                     ├─(3. POST /api/missions)───>│                            │
 │                     │                            ├─(4. Start worker async)───>│
 │                     │<─(5. Return Mission ID)────┤                            │
 │                     │                            │                            │
 │                     ├─(6. Join Socket Room)─────>│                            │
 │                     │                            │                            │
 │                     │                            │<──(7. Agent 1 starts)──────┤
 │                     │<──(8. Socket: Log msg)─────┤                            │
 │                     │                            │                            │
 │                     │                            │<──(9. Agent 2 starts)──────┤
 │                     │<──(10. Socket: Log msg)────┤                            │
 │                     │                            │                            │
 │                     │                            │<──(11. Agents complete)────┤
 │                     │<──(12. Socket: Finished)───┤                            │
 │                     │                            │                            │
 │<─(13. Show review)──┤                            │                            │
 │                     │                            │                            │
 ├─(14. Edit texts)───>│                            │                            │
 │                     ├─(15. PUT /api/missions)───>│                            │
 │                     │<─(16. Confirm edits)───────┤                            │
 │                     │                            │                            │
 ├─(17. Click Export)─>│                            │                            │
 │                     ├─(18. GET /export)─────────>│                            │
 │                     │<─(19. Download ZIP file)───┤                            │
```

---

## 4. Milestone 1: Mock Run Pipeline Flow

Here is the exact data flow that runs in Milestone 1 using mock events:

```text
React Hub Form UI               Express server.js               Mock runMockMission()
       │                                │                                 │
       ├─(1. Submit form values)───────>│                                 │
       │                                ├─(2. Trigger background loop)───>│
       │<─(3. Return 202 Mission ID)────┤                                 │
       │                                │                                 │
       ├─(4. Join Socket room)─────────>│                                 │
       │                                │                                 │
       │                                │<─(5. emit('agent-start'))───────┤
       │<─(6. Receive agent-start)──────┤                                 │
       │                                │                                 │
       │                                │<─(7. emit('mission-log'))───────┤
       │<─(8. Receive mission-log)──────┤                                 │
       │                                │                                 │
       │                                │<─(9. emit('mission-complete'))──┤
       │<─(10. Receive complete)────────┤                                 │
       │                                │                                 │
       ▼                                ▼                                 ▼
 (Renders: Complete screen)    (In-memory mission state updated)  (Worker terminates)
```
