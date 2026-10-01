
require('dotenv').config();

const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: process.env.DB_CA_CERT
  },

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SchoolFinder Backend is running');
});

app.get('/api/schools', (req, res) => {
  const sql = 'SELECT * FROM schools';

  db.query(sql, (err, results) => {
    if (err) {
      console.log('Database error:', err);

      return res.status(500).json({
        message: 'Database error'
      });
    }

    res.json(results);
  });
});

app.get('/api/schools/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'SELECT * FROM schools WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log('Database error:', err);

      return res.status(500).json({
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'School not found'
      });
    }

    res.json(results[0]);
  });
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

module.exports = app;

