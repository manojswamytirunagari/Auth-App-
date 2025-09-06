const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Initialize DB
require('./db');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,               // allow cookies
}));

app.use(cookieParser());
app.use(express.json());

app.use(session({
  name: 'sid',                      // cookie name
  secret: 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true if HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
