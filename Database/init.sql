CREATE DATABASE fitness_tracker;
USE fitness_tracker;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    age INT,
    weight FLOAT,
    height FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    exercise_type VARCHAR(50),
    duration INT,
    calories_burned INT,
    date_performed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_calories_burned INT,
    total_distance_covered FLOAT,
    date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create database user
CREATE USER 'fitness_user'@'%' IDENTIFIED BY 'paul@1972';
GRANT ALL PRIVILEGES ON fitness_tracker.* TO 'fitness_user'@'%';
FLUSH PRIVILEGES;