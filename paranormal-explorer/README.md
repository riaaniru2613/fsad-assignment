# 👻 Paranormal Explorer

A full-stack paranormal investigation platform built with React + Node.js, using JSON files as a database.

## Features

- 🗺️ **Haunted Map** — Interactive world map with 8 documented paranormal sites, danger ratings, and detail panels
- 📜 **Field Stories** — Browse & submit encounter reports with category filtering and a full-screen reader
- ⚔️ **Challenges** — 6 tiered challenges (Easy → Extreme) with point rewards and rank progression
- 🏆 **Leaderboard** — Live rankings of all explorers by total points earned
- 👤 **Profile** — Personal stats, rank tier progression bar, and completed challenge history
- 🔐 **Auth** — JWT-based signup/login with bcrypt password hashing

## Stack

| Layer    | Tech                                  |
|----------|---------------------------------------|
| Frontend | React 18, React Router, Axios         |
| Backend  | Node.js, Express                      |
| Auth     | JWT (jsonwebtoken) + bcrypt           |
| Database | JSON flat files (no external DB)      |
| Fonts    | Cinzel Decorative, Cinzel, IM Fell English |

## Project Structure

```
paranormal-explorer/
├── server/
│   ├── index.js            # Express entry point (port 4000)
│   ├── routes/
│   │   ├── auth.js         # POST /api/auth/signup, /api/auth/login
│   │   └── api.js          # Stories, challenges, leaderboard, locations, profile
│   └── db/
│       ├── db.js           # readDB / writeDB helpers
│       ├── users.json      # User accounts (hashed passwords)
│       ├── scores.json     # Leaderboard scores
│       ├── stories.json    # Field encounter stories (4 seeded)
│       ├── challenges.json # Paranormal challenges (6 seeded)
│       └── locations.json  # Haunted map locations (8 seeded)
├── client/
│   └── src/
│       ├── App.js
│       ├── index.css       # Full gothic dark theme
│       ├── context/
│       │   └── AuthContext.js
│       ├── components/
│       │   └── Navbar.js
│       └── pages/
│           ├── AuthPage.js
│           ├── MapPage.js
│           ├── StoriesPage.js
│           ├── ChallengesPage.js
│           ├── LeaderboardPage.js
│           └── ProfilePage.js
└── package.json
```

## Setup & Run

### 1. Install dependencies

```bash
# From the root directory
cd server && npm install
cd ../client && npm install
```

### 2. Start the backend (Terminal 1)

```bash
cd server
node index.js
# → Server running on http://localhost:4000
```

### 3. Start the frontend (Terminal 2)

```bash
cd client
npm start
# → React app on http://localhost:3000
```

The React app proxies `/api/*` requests to `localhost:4000` automatically.

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Register new account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/stories` | No | List all stories |
| POST | `/api/stories` | Yes | Submit new story |
| GET | `/api/challenges` | No | List all challenges |
| POST | `/api/challenges/:id/complete` | Yes | Mark challenge done |
| GET | `/api/leaderboard` | No | Top 20 scores |
| GET | `/api/locations` | No | Haunted map sites |
| GET | `/api/profile` | Yes | Current user profile |

## Rank System

| Rank | Points Required |
|------|----------------|
| Novice Wanderer | 0 |
| Curious Soul | 100 |
| Ghost Tracker | 500 |
| Shadow Seeker | 1,000 |
| Specter Hunter | 2,500 |
| Phantom Sovereign | 5,000 |

## Extending the Project

- **Real DB**: Replace `readDB`/`writeDB` in `db.js` with SQLite or MongoDB calls
- **File uploads**: Add `multer` to accept photo/audio evidence for challenges
- **Story ratings**: Add a `POST /api/stories/:id/rate` endpoint
- **Map**: Swap the SVG map for `react-leaflet` with OpenStreetMap tiles
- **Admin panel**: Add a `role` field to users for verification powers
