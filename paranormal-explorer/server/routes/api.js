const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db/db');
const { JWT_SECRET } = require('./auth');

// Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ── STORIES ──────────────────────────────────────────────
router.get('/stories', (req, res) => {
  const { stories } = readDB('stories.json');
  res.json(stories);
});

router.post('/stories', auth, (req, res) => {
  const { title, location, category, excerpt, content, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  const db = readDB('stories.json');
  const story = {
    id: uuidv4(),
    title,
    location: location || 'Unknown',
    author: req.user.username,
    date: new Date().toISOString().split('T')[0],
    category: category || 'Other',
    rating: 0,
    reads: 0,
    excerpt: excerpt || content.slice(0, 100) + '...',
    content,
    tags: tags || [],
    verified: false
  };
  db.stories.push(story);
  writeDB('stories.json', db);
  res.status(201).json(story);
});

// ── CHALLENGES ───────────────────────────────────────────
router.get('/challenges', (req, res) => {
  const { challenges } = readDB('challenges.json');
  res.json(challenges);
});

router.post('/challenges/:id/complete', auth, (req, res) => {
  const usersDB = readDB('users.json');
  const challengesDB = readDB('challenges.json');
  const scoresDB = readDB('scores.json');

  const user = usersDB.users.find(u => u.id === req.user.id);
  const challenge = challengesDB.challenges.find(c => c.id === req.params.id);

  if (!user || !challenge) return res.status(404).json({ error: 'Not found' });
  if (user.completedChallenges.includes(challenge.id))
    return res.status(409).json({ error: 'Already completed' });

  user.completedChallenges.push(challenge.id);
  user.totalPoints += challenge.points;
  user.rank = getRank(user.totalPoints);

  challenge.completions += 1;

  const scoreEntry = scoresDB.scores.find(s => s.userId === user.id);
  if (scoreEntry) {
    scoreEntry.points = user.totalPoints;
    scoreEntry.completed = user.completedChallenges.length;
  } else {
    scoresDB.scores.push({
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      points: user.totalPoints,
      completed: user.completedChallenges.length,
      rank: user.rank
    });
  }

  writeDB('users.json', usersDB);
  writeDB('challenges.json', challengesDB);
  writeDB('scores.json', scoresDB);

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, pointsEarned: challenge.points });
});

// ── LEADERBOARD ──────────────────────────────────────────
router.get('/leaderboard', (req, res) => {
  const { scores } = readDB('scores.json');
  const sorted = [...scores].sort((a, b) => b.points - a.points).slice(0, 20);
  res.json(sorted);
});

// ── LOCATIONS ────────────────────────────────────────────
router.get('/locations', (req, res) => {
  const { locations } = readDB('locations.json');
  res.json(locations);
});

// ── USER PROFILE ─────────────────────────────────────────
router.get('/profile', auth, (req, res) => {
  const { users } = readDB('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

function getRank(points) {
  if (points >= 5000) return 'Phantom Sovereign';
  if (points >= 2500) return 'Specter Hunter';
  if (points >= 1000) return 'Shadow Seeker';
  if (points >= 500) return 'Ghost Tracker';
  if (points >= 100) return 'Curious Soul';
  return 'Novice Wanderer';
}

module.exports = router;
