const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

// Middleware to protect routes
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Register endpoint
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hash]
    );

    req.session.userId = result.rows[0].id;
    req.session.email = email;

    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    if (err.code === '23505') { // unique violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    req.session.userId = user.id;
    req.session.email = user.email;

    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Session check
router.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ loggedIn: false });
  res.json({ loggedIn: true, userId: req.session.userId, email: req.session.email });
});

// Protected dashboard route
router.get('/dashboard', requireLogin, (req, res) => {
  res.json({ message: `Welcome ${req.session.email}! This is your dashboard.` });
});

module.exports = router;
