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
import Cookies from 'js-cookie';

// Import utility modules
import DB from "@/lib/DB";
import Logger from "@/lib/logger";

// Load private and public keys for JWT
const PRIV_KEY_FILE = "./data/key.pem";
const PUB_KEY_FILE = "./data/public.pem";
const PRIV_KEY = fs.readFileSync(PRIV_KEY_FILE, { encoding: "ascii" });
const PUB_KEY = fs.readFileSync(PUB_KEY_FILE, { encoding: "ascii" });

// Session validity duration (1 hour)
const SESSION_VALID_TIME_MS = 1000 * 60 * 60; // 1h

interface UserData {
  id: number;
  username: string;
  session_token: string;
  profile_image: string | null; // Convert BLOB to Base64 string or null
  created_at: string; // Use ISO string for dates
  updated_at: string; // Use ISO string for dates
}

// Connect to the database and log the result
DB.connect((err) => {
  if (err) {
    Logger({
      status: "ERROR",
      message: `Could not connect to database: ${err}`,
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
export async function Register(username: string, password: string): Promise<{ status: number; message: string; }> {
  try {
    if (!username || !password) {
      Logger({ status: "WARN", message: "Username and password are required" });
      return { status: 400, message: "Username and password are required" };
    }

    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    const values = [username, hash];

    await new Promise<void>((resolve, reject) => {
      DB.query(sql, values, (err) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error executing query: ${err.message}`,
          });
          reject(err);
        } else {
          Logger({ status: "INFO", message: `User registered: ${username}` });
          resolve();
        }
      });
    });

    return { status: 201, message: "User registered successfully" };
  } catch (err) {
    Logger({ status: "ERROR", message: `Error registering user: ${err}` });
    return {
      status: 500,
      message: "An error occurred while registering the user",
    };
  }
}

/**
 * Logs in a user and returns a session token.
 * 
 * @param {string} username - The username of the user trying to log in.
 * @param {string} password - The password of the user trying to log in.
 * @returns {Promise<{ status: number; message: string; token?: string }>} The result of the login attempt, including a token if successful.
 */
export async function Login(username: string, password: string): Promise<{ status: number; message: string; token?: string; }> {
  try {
    if (!username || !password) {
      Logger({ status: "WARN", message: "Username and password are required" });
      return { status: 400, message: "Username and password are required" };
    }

    const sql =
      "SELECT username, password, session_token FROM users WHERE username = ?";
    const result: any[] = await new Promise<any[]>((resolve, reject) => {
      DB.query(sql, [username], (err, res) => {
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

    if (!result || result.length === 0) {
      Logger({ status: "WARN", message: "User not found" });
      return { status: 404, message: "User not found" };
    }

    const user = result[0];
    if (!user.password) {
      Logger({ status: "ERROR", message: "User data is missing" });
      return { status: 500, message: "User data is missing" };
    }

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
          Logger({
            status: "ERROR",
            message: `Error updating session token: ${err}`,
          });
          reject(err);
        } else {
          Logger({
            status: "INFO",
            message: `Session token updated for user: ${username}`,
          });
          resolve();
        }
      });
    });

    return { status: 200, message: "Login successful", token };
  } catch (error) {
    Logger({ status: "ERROR", message: `Login error: ${error}` });
    return {
      status: 500,
      message: "An error occurred while logging in",
    };
  }
}

/**
 * Retrieves the session cookie from the browser.
 * 
 * @returns {Promise<string | null>} The session cookie, or null if not found.
 */
export async function getSessionCookie(): Promise<string | null> {
  try {
    const cookie = Cookies.get("session_token");
    if (cookie) {
      Logger({ status: "DEBUG", message: `User Session Cookie: ${cookie}` });
      return cookie;
    } else {
      Logger({ status: "DEBUG", message: "No session cookie found." });
      return null;
    }
  } catch (error) {
    Logger({
      status: "ERROR",
      message: `Error retrieving session cookie: ${error}`,
    });
    return null;
  }
}

/**
 * Checks if the user's session is valid.
 * 
 * @param {string} username - The username of the user.
 * @returns {Promise<boolean>} True if the session is valid, false otherwise.
 */
export async function isSessionValid(username: string): Promise<boolean> {
  try {
    if (!username) {
      Logger({ status: "WARN", message: "Username is required" });
      return false;
    }
      const sessionToken = await getSessionCookie();

    if (!sessionToken) {
      Logger({ status: "WARN", message: "Session token is missing" });
      return false;
    }

    const sql = "SELECT session_token FROM users WHERE username = ?";
    const values = [username];

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

    if (!result || result.length === 0) {
      Logger({
        status: "WARN",
        message: "User not found or session token missing",
      });
      return false;
    }

    const user = result[0];
    if (!user || !user.session_token) {
      Logger({ status: "WARN", message: "User session token is missing" });
      return false;
    }

    try {
      jwt.verify(sessionToken, PUB_KEY, { algorithms: ["RS256"] });
      Logger({
        status: "INFO",
        message: `Session token is valid for user: ${username}`,
      });
      return true;
    } catch (err) {
      Logger({ status: "ERROR", message: `Invalid session token: ${err}` });
      return false;
    }
  } catch (error) {
    Logger({
      status: "ERROR",
      message: `Error checking session validity: ${error}`,
    });
    return false;
  }
}

/**
 * Retrieves the username associated with a given session token.
 * @returns {Promise<any[id: number, session_token: string, profile_image: BLOB, created_at: Date, updated_at: Date] | null>} The username associated with the session token, or null if not found.
 */
export async function getUserData(): Promise<UserData | null> {
  const sql = "SELECT id, username, session_token, profile_image, created_at, updated_at FROM users WHERE session_token = ?";
  const token = await getSessionCookie();
  const values = [token];

  try {
    const result: UserData[] = await new Promise((resolve, reject) => {
      DB.query(sql, values, (err, result) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Database query error: ${err.message}`,
          });
          reject(err);
        } else {
          resolve(result as UserData[]);
        }
      });
    });

    if (result.length === 0) {
      Logger({
        status: "DEBUG",
        message: "No user found for the given session token.",
      });
      return null;
    } else {
      const user = result[0];
      return {
        ...user,
        created_at: user.created_at,
        updated_at: user.updated_at,
        profile_image: user.profile_image ? atob(user.profile_image ): null, // Konvertiere BLOB in Base64-String
      };
    }
  } catch (error) {
    Logger({
      status: "ERROR",
      message: `Error retrieving user by session token: ${error}`,
    });
    return null;
  }
}