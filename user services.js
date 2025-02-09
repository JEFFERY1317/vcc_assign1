const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: '192.168.233.133 ', 
    user: 'fitness_user',
    password: 'paul@1972',
    database: 'fitness_tracker'
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database successfully');
});


// Get specific user profile
app.get('/api/profiles/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    });
});

// Create new user profile
app.post('/api/profiles', (req, res) => {
    const { name, age, weight, height } = req.body;
    
    // Basic validation
    if (!name || !age || !weight || !height) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const user = { name, age, weight, height };
    
    db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            console.error('Error creating profile:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: result.insertId,
            ...user
        });
    });
});

// Update user profile
app.put('/api/profiles/:id', (req, res) => {
    const { name, age, weight, height } = req.body;
    const userId = req.params.id;

    db.query(
        'UPDATE users SET ? WHERE id = ?',
        [{ name, age, weight, height }, userId],
        (err, result) => {
            if (err) {
                console.error('Error updating profile:', err);
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ id: userId, name, age, weight, height });
        }
    );
});

// Start the server
app.listen(3002, () => {
    console.log('User Profile Service running on port 3002');
});