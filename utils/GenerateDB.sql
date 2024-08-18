-- Copyright (c) 2024 KibaOfficial
-- 
-- This software is released under the MIT License.
-- https://opensource.org/licenses/MIT

-- Create Databse
CREATE DATABASE IF NOT EXISTS shortme;

-- Use created database
USE shortme;

-- Createh the "users" table
CREATE TABLE users (
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  session_token TEXT DEFAULT NULL,
  profile_image TEXT DEFAULT NULL,
  PRIMARY KEY (username)
);

-- Create the "links" table
CREATE TABLE links (
  code VARCHAR(255) UNIQUE NOT NULL,
  origin VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  PRIMARY KEY (code),
  FOREIGN KEY (username) REFERENCES users(username)
);

