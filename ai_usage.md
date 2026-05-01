# AI Usage Documentation

**Project:** Paranormal Explorer  
**Model Used:** Claude Sonnet 4.6 (Anthropic)  
**Date:** May 2026

---

## Overview

This project was built entirely through a single conversational prompt to Claude, an AI assistant made by Anthropic. No code was written manually. The AI generated the full codebase — backend, frontend, seed data, styling, and documentation — from a one-line brief.

---

## The Prompt

> *"write me a paranormal explorer code base that has maps, challenges, leaderboard, stories, signup, login. use react and nodejs and json files for db. make me a small project."*

That was the complete specification. No wireframes, no schema design, no further clarification was requested or given.

---

## What the AI Did

### Architecture Decisions
The AI made all structural decisions independently:
- Chose Express over other Node frameworks for simplicity
- Designed a flat JSON file database with a `readDB`/`writeDB` helper pattern
- Decided on JWT + bcrypt for auth (stateless, no session store needed)
- Used React context (`AuthContext`) for global auth state
- Proxied the React dev server to Express to avoid CORS complexity

### Files Generated

| File | Lines | Notes |
|------|-------|-------|
| `server/index.js` | 16 | Express entry point |
| `server/routes/auth.js` | 55 | Signup, login, JWT |
| `server/routes/api.js` | 110 | All feature endpoints |
| `server/db/db.js` | 12 | JSON read/write utility |
| `server/db/stories.json` | 80 | 4 seeded stories with full narrative content |
| `server/db/challenges.json` | 60 | 6 tiered challenges with requirements |
| `server/db/locations.json` | 75 | 8 real-world haunted sites with coordinates |
| `client/src/index.css` | 430 | Full gothic dark theme from scratch |
| `client/src/App.js` | 50 | Routing and shell |
| `client/src/context/AuthContext.js` | 45 | Auth state management |
| `client/src/components/Navbar.js` | 40 | Responsive sidebar nav |
| `client/src/pages/AuthPage.js` | 65 | Login and signup UI |
| `client/src/pages/MapPage.js` | 120 | SVG world map with projections |
| `client/src/pages/StoriesPage.js` | 115 | Story browser, modal reader, submit form |
| `client/src/pages/ChallengesPage.js` | 90 | Challenge cards with completion flow |
| `client/src/pages/LeaderboardPage.js` | 65 | Ranked table with user highlighting |
| `client/src/pages/ProfilePage.js` | 95 | Stats and rank progression |
| `README.md` | 115 | Setup instructions and API reference |

**Total: ~1,638 lines of code generated in one session.**

### Creative Choices Made by AI
Things that were not requested but were added by the AI:

- **Gothic aesthetic** — Cinzel Decorative/IM Fell English fonts, blood-red and dark void color palette, noise texture overlay, glowing borders
- **Seed data** — 4 fully written paranormal encounter stories with narrative prose, 6 tiered challenges, 8 real haunted sites (Eastern State Penitentiary, Waverly Hills, Poveglia Island, etc.)
- **Rank system** — 6 tiers from "Novice Wanderer" to "Phantom Sovereign" with point thresholds
- **SVG world map** — Custom lat/lng projection rendering location dots without any map library dependency
- **Danger rating system** — 5-dot visual danger indicators for each location
- **Verified badge** — Stories can be marked as verified by the community
- **Progress bar** — Rank progression shown as a visual bar in the profile
- **Toast notifications** — Green confirmation flash when completing a challenge
- **Responsive nav** — Collapses to icon-only on smaller screens

---

## How the Interaction Worked

1. **Single prompt** was submitted describing the desired features
2. The AI read its internal frontend design skill guidelines before writing any CSS
3. The AI generated each file sequentially, making decisions about naming, structure, and content as it went
4. The AI ran a verification step at the end (Node.js `require` checks + JSON counts) to confirm the server loaded correctly
5. The AI packaged everything into a zip and wrote this README

There were **no follow-up corrections or debug cycles** — the code was generated correctly in one pass.

---

## What Was Not AI-Generated

- Nothing. The developer's only contribution was the one-line prompt and the request for this document.

---

## Honest Limitations

- The SVG world map is approximate — land masses are rough polygon shapes, not real GeoJSON
- No test suite was generated
- The JSON database has no concurrency protection (last-write-wins on simultaneous requests)
- Passwords are hashed but the JWT secret is hardcoded (`paranormal_secret_key_2024`) — move this to an environment variable before any real deployment
- No input sanitisation beyond basic presence checks

---

## Tools Used

| Tool | Purpose |
|------|---------|
| Claude Sonnet 4.6 | Code generation, architecture, seed data, styling, docs |
| Anthropic Claude.ai | Interface for interacting with the model |

No other tools, libraries, templates, or external code sources were used during generation.

---

*This document was also generated by Claude, requested immediately after the main codebase was built.*
