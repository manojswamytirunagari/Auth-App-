// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // your Render env variable
  ssl: {
    rejectUnauthorized: false, // required for Render internal URL
  },
});

pool.on('connect', () => {
  console.log('Connected to Postgres');
});

// Create users table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

pool.query(createTableQuery)
  .then(() => console.log('Users table ready'))
  .catch(err => console.error('Error creating users table', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
