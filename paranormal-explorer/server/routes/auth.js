const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db/db');

const JWT_SECRET = 'paranormal_secret_key_2024';

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const db = readDB('users.json');
    if (db.users.find(u => u.email === email))
      return res.status(409).json({ error: 'Email already registered' });
    if (db.users.find(u => u.username === username))
      return res.status(409).json({ error: 'Username taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      username,
      email,
      password: hashed,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
      joinedAt: new Date().toISOString(),
      totalPoints: 0,
      rank: 'Novice Wanderer',
      completedChallenges: []
    };

    db.users.push(user);
    writeDB('users.json', db);

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const db = readDB('users.json');
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
module.exports.JWT_SECRET = JWT_SECRET;
