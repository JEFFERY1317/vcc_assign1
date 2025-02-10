const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Database connection
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

// Get all user profiles
app.get('/api/profiles', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching profiles:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Create new user profile
app.post('/api/profiles', (req, res) => {
    const { name, age, weight, height } = req.body;
    
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

// New endpoint for complete user data
app.get('/api/profiles/:id/complete', (req, res) => {
    const userId = req.params.id;
    
    const query = `
        SELECT 
            u.id, u.name, u.age, u.weight, u.height,
            e.exercise_type, e.duration, e.calories_burned, e.date_performed,
            p.total_calories_burned, p.total_distance_covered, p.date_recorded
        FROM users u
        LEFT JOIN exercises e ON u.id = e.user_id
        LEFT JOIN progress p ON u.id = p.user_id
        WHERE u.id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching complete profile:', err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Format the response
        const userData = {
            id: results[0].id,
            name: results[0].name,
            age: results[0].age,
            weight: results[0].weight,
            height: results[0].height,
            exercises: [],
            progress: []
        };
// Add exercises and progress
results.forEach(row => {
    if (row.exercise_type) {
        userData.exercises.push({
            type: row.exercise_type,
            duration: row.duration,
            calories_burned: row.calories_burned,
            date: row.date_performed
        });
    }
    if (row.total_calories_burned) {
        userData.progress.push({
            total_calories_burned: row.total_calories_burned,
            total_distance_covered: row.total_distance_covered,
            date: row.date_recorded
        });
    }
});

res.json(userData);
});
});

app.listen(3002, '0.0.0.0', () => {
console.log('User Profile Service running on port 3002');
});
