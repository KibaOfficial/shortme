/* eslint-disable import/no-anonymous-default-export */
// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use server";

// Import necessary libraries
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

// Import utility modules
import DB from "@/lib/DB";
import Logger from "@/lib/logger";

// Load private and public keys for JWT
const PRIV_KEY_FILE = "./data/key.pem";
const PUB_KEY_FILE = "./data/public.pem";
const PRIV_KEY = fs.readFileSync(PRIV_KEY_FILE, { encoding: "ascii" });
const PUB_KEY = fs.readFileSync(PUB_KEY_FILE, { encoding: "ascii" });

// Session validity duration (1 hour)
const SESSION_VALID_TIME_MS = 1000 * 60 * 60; // 1 hour

// Connect to the database and log the result
DB.connect((err) => {
  if (err) {
    Logger({
      status: "ERROR",
      message: `Could not connect to database: ${err.message}`,
    });
  } else {
    Logger({ status: "INFO", message: "Connected to database" });
  }
});

/**
 * Registers a new user in the database.
 *
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Promise<{ status: number; message: string }>} The result of the registration.
 */
export async function register(username: string, password: string): Promise<{ status: number; message: string }> {
  if (!username || !password) {
    Logger({ status: "WARN", message: "Username and password are required" });
    return { status: 400, message: "Username and password are required" };
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    await new Promise<void>((resolve, reject) => {
      DB.query(sql, [username, hash], (err) => {
        if (err) {
          Logger({ status: "ERROR", message: `Error executing query: ${err.message}` });
          reject(err);
        } else {
          Logger({ status: "INFO", message: `User registered successfully: ${username}` });
          resolve();
        }
      });
    });

    return { status: 201, message: "User registered successfully" };
  } catch (err) {
    Logger({ status: "ERROR", message: `Error registering user: ${err}` });
    return { status: 500, message: "An error occurred while registering the user" };
  }
}

/**
 * Logs in a user and returns a session token.
 *
 * @param {string} username - The username of the user trying to log in.
 * @param {string} password - The password of the user trying to log in.
 * @returns {Promise<{ status: number; message: string; token?: string }>} The result of the login attempt, including a token if successful.
 */
export async function login(username: string, password: string): Promise<{ status: number; message: string; token?: string }> {
  if (!username || !password) {
    Logger({ status: "WARN", message: "Username and password are required" });
    return { status: 400, message: "Username and password are required" };
  }

  try {
    const sql = "SELECT username, password, session_token FROM users WHERE username = ?";
    const result: any[] = await new Promise<any[]>((resolve, reject) => {
      DB.query(sql, [username], (err, res) => {
        if (err) {
          Logger({ status: "ERROR", message: `Error executing query: ${err.message}` });
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    if (result.length === 0) {
      Logger({ status: "WARN", message: "User not found" });
      return { status: 404, message: "User not found" };
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      Logger({ status: "WARN", message: "Invalid password" });
      return { status: 401, message: "Invalid password" };
    }

    const token = jwt.sign({ userid: user.username }, PRIV_KEY, {
      algorithm: "RS256",
      expiresIn: SESSION_VALID_TIME_MS / 1000,
    });

    const updateSql = "UPDATE users SET session_token = ? WHERE username = ?";
    await new Promise<void>((resolve, reject) => {
      DB.query(updateSql, [token, username], (err) => {
        if (err) {
          Logger({ status: "ERROR", message: `Error updating session token: ${err.message}` });
          reject(err);
        } else {
          Logger({ status: "INFO", message: `Session token updated successfully for user: ${username}` });
          resolve();
        }
      });
    });

    return { status: 200, message: "Login successful", token };
  } catch (err) {
    Logger({ status: "ERROR", message: `Login error: ${err}` });
    return { status: 500, message: "An error occurred while logging in" };
  }
}

/**
 * Logs out a user and deletes the session token.
 * 
 * @param {string} username
 * @returns {Promise<{ status: number; message: string; }>}
 */
export async function logout(username: string): Promise<{ status: number; message: string }> {
  if (!username) {
    Logger({ status: "ERROR", message: "User not found" });
    return { status: 404, message: "User not found" };
  }

  const sql = "UPDATE users SET session_token = NULL WHERE username = ?";
  const values = [username];

  try {
    await new Promise<void>((resolve, reject) => {
      DB.query(sql, values, (err) => {
        if (err) {
          Logger({ status: "ERROR", message: `Error while updating user: ${err}` });
          reject({ status: 500, message: "Unexpected error" });
        } else {
          Cookies.remove('session_token');
          resolve();
        }
      });
    });

    return { status: 200, message: "User logged out successfully" };
  } catch (err) {
    Logger({ status: "ERROR", message: `Error logging out user: ${err}` });
    return { status: 500, message: "Unexpected error" };
  }
}

/**
 * Retrieves the session cookie from the browser.
 *
 * @returns {Promise<{ status: number; message: string; cookie?: string }>} The session cookie, or null if not found.
 */
export async function getSessionCookie(): Promise<{ status: number; message: string; cookie?: string;}> {
  try {
    const cookie = Cookies.get("session_token");
    if (cookie) {
      Logger({ status: "DEBUG", message: `User Session Cookie: ${cookie}` });
      return { status: 200, message: "Session cookie found", cookie };
    } else {
      Logger({ status: "DEBUG", message: "No session cookie found." });
      return { status: 404, message: "No session cookie found." };
    }
  } catch (error) {
    Logger({
      status: "ERROR",
      message: `Error retrieving session cookie: ${error}`,
    });
    return {
      status: 500,
      message: "An error occurred while retrieving the session cookie.",
    };
  }
}

/**
 * Checks if the user's session is valid.
 * @param {string} session_token - The session token of the user.
 * @returns {Promise<{status: number; message: string; isValid: boolean;}>} True if the session is valid, false otherwise.
 */
export async function isSessionValid(session_token: string): Promise<{ status: number; message: string; isValid: boolean }> {
  try {
    if (!session_token) {
      Logger({ status: "WARN", message: "Session token is required" });
      return { status: 400, message: "Session token is required", isValid: false };
    }

    const sql = "SELECT session_token FROM users WHERE session_token = ?";
    const values = [session_token];

    const result = await new Promise<any[]>((resolve, reject) => {
      DB.query(sql, values, (err, res) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error executing query: ${err.message}`,
          });
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    if (result.length === 0) {
      Logger({
        status: "WARN",
        message: "Session token not found or invalid",
      });
      return { status: 404, message: "Session token not found or invalid", isValid: false };
    }

    const user = result[0];
    try {
      jwt.verify(user.session_token, PUB_KEY, { algorithms: ["RS256"] });
      Logger({ status: "INFO", message: `Session token is valid` });
      return { status: 200, message: "Session token is valid", isValid: true };
    } catch (err) {
      Logger({ status: "ERROR", message: `Invalid session token: ${err}` });
      return { status: 401, message: "Invalid session token", isValid: false };
    }
  } catch (error) {
    Logger({
      status: "ERROR",
      message: `Error checking session validity: ${error}`,
    });
    return { status: 500, message: "An error occurred while checking the session validity.", isValid: false };
  }
}
