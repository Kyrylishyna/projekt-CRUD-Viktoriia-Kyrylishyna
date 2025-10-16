CREATE DATABASE IF NOT EXISTS book_tracker;
USE book_tracker;

CREATE TABLE IF NOT EXISTS readers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS books(
    id INT AUTO_INCREMENT PRIMARY KEY,
    reader_id INT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    FOREIGN KEY (reader_id) REFERENCES readers(id) ON DELETE SET NULL
);