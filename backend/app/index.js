const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const mysql = require('mysql2/promise');

const app = express();
const port = 5000;

const pool = mysql.createPool({
  host: 'mysql',
  user: 'my_user',
  password: 'my_password',
  database: 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// API endpoint to fetch all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    console.log('Bookings fetched from database:', rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to fetch a specific booking by ID
app.get('/api/booking/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Received request for booking ID: ${id}`);

    // Ensure id is an integer
    if (isNaN(parseInt(id, 10))) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log(`Booking with ID ${id} fetched from database:`, rows[0]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the API. Use /api/bookings to see the data.');
});

// Database connection test route
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    res.status(200).json({ message: 'Connection successful', result: rows });
  } catch (error) {
    console.error('Error testing database connection:', error);
    res.status(500).send('Database connection failed');
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { service, doctorName, date, start_time, endTime } = req.body;

    
    if (!service || !doctorName || !date || !start_time || !endTime) {
      return res.status(400).json({ errors: ['All fields are required'] });
    }

    const [result] = await pool.query('INSERT INTO bookings (service, doctor_name, date, start_time, end_time) VALUES (?, ?, ?, ?, ?)', 
      [service, doctorName, date, start_time, endTime]);

    if (result.affectedRows === 1) {
      return res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
    } else {
      throw new Error('Failed to insert booking');
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ errors: ['Failed to create booking', error.message] });
  }
});










app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
