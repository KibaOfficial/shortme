-- Copyright (c) 2024 KibaOfficial
-- 
-- This software is released under the MIT License.
-- https://opensource.org/licenses/MIT

-- Create Database
CREATE DATABASE IF NOT EXISTS shortme;

-- Use created database
USE shortme;

-- Create the "users" table
CREATE TABLE users (
  id INT AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL,
  session_token TEXT DEFAULT NULL,
  profile_image TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Create the "links" table
CREATE TABLE links (
  code VARCHAR(20) UNIQUE NOT NULL,
  origin VARCHAR(2048) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  click_count INT DEFAULT 0,
  PRIMARY KEY (code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


