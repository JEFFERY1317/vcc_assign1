const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: '192.168.233.133',
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

// Get all progress entries
app.get('/api/progress', (req, res) => {
    db.query('SELECT * FROM progress', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add new progress entry
app.post('/api/progress', (req, res) => {
    const { user_id, total_calories_burned, total_distance_covered } = req.body;
    
    if (!user_id || !total_calories_burned || !total_distance_covered) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('INSERT INTO progress SET ?', 
        { user_id, total_calories_burned, total_distance_covered }, 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                id: result.insertId,
                user_id,
                total_calories_burned,
                total_distance_covered
            });
    });
});

app.listen(3003, () => {
    console.log('Progress Service running on port 3003');
});
