require('dotenv').config();

const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   HOME / TEST API
========================= */

app.get('/', (req, res) => {
  res.send('SchoolFinder Backend is running');
});

/* =========================
   REGISTER
========================= */

app.post('/api/register', async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email and password are required'
    });
  }

  try {

    const checkSql =
      'SELECT * FROM users WHERE email = ?';

    db.query(
      checkSql,
      [email],
      async (err, results) => {

        if (err) {
          console.log('Database error:', err);

          return res.status(500).json({
            message: 'Database error'
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            message: 'Email already registered'
          });
        }

        const hashedPassword =
          await bcrypt.hash(password, 10);

        const insertSql =
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

        db.query(
          insertSql,
          [name, email, hashedPassword],
          (err, result) => {

            if (err) {
              console.log('Insert error:', err);

              return res.status(500).json({
                message: 'Could not register user'
              });
            }

            res.status(201).json({
              message: 'Registration successful',
              userId: result.insertId
            });

          }
        );

      }
    );

  } catch (error) {

    console.log('Register error:', error);

    res.status(500).json({
      message: 'Something went wrong'
    });

  }

});

/* =========================
   LOGIN
========================= */

app.post('/api/login', (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  const sql =
    'SELECT * FROM users WHERE email = ?';

  db.query(
    sql,
    [email],
    async (err, results) => {

      if (err) {
        console.log('Database error:', err);

        return res.status(500).json({
          message: 'Database error'
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      const user = results[0];

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      /* JWT SECRET FROM ENVIRONMENT VARIABLE */

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      );

      res.json({
        message: 'Login successful',

        token: token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

    }
  );

});

/* =========================
   FAVORITES
========================= */

app.post('/api/favorites', (req, res) => {

  const { userId, schoolId } = req.body;

  if (!userId || !schoolId) {
    return res.status(400).json({
      message: 'User ID and School ID are required'
    });
  }

  const sql = `
    INSERT INTO favorites (user_id, school_id)
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [userId, schoolId],
    (err, result) => {

      if (err) {

        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            message: 'School already added to favorites'
          });
        }

        console.log('Favorite error:', err);

        return res.status(500).json({
          message: 'Could not add favorite'
        });
      }

      res.status(201).json({
        message: 'School added to favorites',
        favoriteId: result.insertId
      });

    }
  );

});

/* =========================
   GET ALL SCHOOLS
========================= */

app.get('/api/schools', (req, res) => {

  const sql =
    'SELECT * FROM schools';

  db.query(
    sql,
    (err, results) => {

      if (err) {
        console.log('Database error:', err);

        return res.status(500).json({
          message: 'Database error'
        });
      }

      res.json(results);

    }
  );

});

/* =========================
   GET CITIES
========================= */

app.get('/api/cities', (req, res) => {

  const sql = `
    SELECT DISTINCT city
    FROM schools
    WHERE city IS NOT NULL
    ORDER BY city
  `;

  db.query(
    sql,
    (err, results) => {

      if (err) {
        console.log('Database error:', err);

        return res.status(500).json({
          message: 'Database error'
        });
      }

      const cities =
        results.map(item => item.city);

      res.json(cities);

    }
  );

});

/* =========================
   GET BOARDS
========================= */

app.get('/api/boards', (req, res) => {

  const sql = `
    SELECT DISTINCT board
    FROM schools
    WHERE board IS NOT NULL
    ORDER BY board
  `;

  db.query(
    sql,
    (err, results) => {

      if (err) {
        console.log('Database error:', err);

        return res.status(500).json({
          message: 'Database error'
        });
      }

      const boards =
        results.map(item => item.board);

      res.json(boards);

    }
  );

});

/* =========================
   GET SCHOOL BY ID
========================= */

app.get('/api/schools/:id', (req, res) => {

  const id = req.params.id;

  const sql =
    'SELECT * FROM schools WHERE id = ?';

  db.query(
    sql,
    [id],
    (err, results) => {

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

    }
  );

});

/* =========================
   LOCAL SERVER
========================= */

if (require.main === module) {

  app.listen(3000, () => {
    console.log(
      'Server running on http://localhost:3000'
    );
  });

}

/* =========================
   VERCEL
========================= */

module.exports = app;