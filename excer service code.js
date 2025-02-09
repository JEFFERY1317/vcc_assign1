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