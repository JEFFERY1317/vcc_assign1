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

app.get('/api/exercises', (req, res) => {
    db.query('SELECT * FROM exercises', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/exercises', (req, res) => {
    const { user_id, exercise_type, duration, calories_burned } = req.body;
    db.query('INSERT INTO exercises SET ?', 
        { user_id, exercise_type, duration, calories_burned }, 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId });
    });
});

app.listen(3001, () => {
    console.log('Exercise Service running on port 3001');
});
