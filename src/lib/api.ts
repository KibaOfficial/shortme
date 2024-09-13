/* eslint-disable import/no-anonymous-default-export */
// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use server";

// Libs
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

// utils
import DB from "@/lib/DB";
import Logger from "@/lib/logger";

// Load private and public keys for JWT
const PRIV_KEY_FILE = "./data/key.pem";
const PUB_KEY_FILE = "./data/public.pem";
const PRIV_KEY = fs.readFileSync(PRIV_KEY_FILE, { encoding: "ascii" });
const PUB_KEY = fs.readFileSync(PUB_KEY_FILE, { encoding: "ascii" });

const SESSION_VALID_TIME_MS = 1000 * 60 * 60; // 1 hour

// Connect to the db
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
 * @param {string} username - username of the new user.
 * @param {string} password - password of the new user.
 * @returns {Promise<{ status: number; message: string }>} result of registration.
 */
export async function register(
  username: string,
  password: string
): Promise<{ status: number; message: string }> {
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
          Logger({
            status: "ERROR",
            message: `Error executing query: ${err.message}`,
          });
          reject(err);
        } else {
          Logger({
            status: "INFO",
            message: `User registered successfully: ${username}`,
          });
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
 * @param {string} username - username of user trying to log in.
 * @param {string} password - password of user trying to log in.
 * @returns {Promise<{ status: number; message: string; token?: string }>} result of the login attempt, sends back a token if successful.
 */
export async function login(
  username: string,
  password: string
): Promise<{ status: number; message: string; token?: string }> {
  if (!username || !password) {
    Logger({ status: "WARN", message: "Username and password are required" });
    return { status: 400, message: "Username and password are required" };
  }

  try {
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

    if (result.length === 0) {
      Logger({ status: "WARN", message: "User not found" });
      return { status: 404, message: "User not found" };
    }

    const user = result[0];
    if (!user) {
      Logger({ status: "ERROR", message: "User not found" });
      return { status: 404, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      Logger({ status: "WARN", message: "Invalid password" });
      return { status: 401, message: "Invalid password" };
    }

    const token = jwt.sign({ userid: user.id }, PRIV_KEY, {
      algorithm: "RS256",
      expiresIn: SESSION_VALID_TIME_MS / 1000,
    });

    const updateSql = "UPDATE users SET session_token = ? WHERE username = ?";
    await new Promise<void>((resolve, reject) => {
      DB.query(updateSql, [token, username], (err) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error updating session token: ${err.message}`,
          });
          reject(err);
        } else {
          Logger({
            status: "INFO",
            message: `Session token updated successfully for user: ${username}`,
          });
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
 * @param {string} username - username of user trying to log out
 * @returns {Promise<{ status: number; message: string; }>} - result of the logout attempt
 */
export async function logout(
  username: string
): Promise<{ status: number; message: string }> {
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
          Logger({
            status: "ERROR",
            message: `Error while updating user: ${err}`,
          });
          reject({ status: 500, message: "Unexpected error" });
        } else {
          Cookies.remove("session_token");
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
 * Checks if the user's session is valid.
 * @param {string} session_token - The session token of the user.
 * @returns {Promise<{status: number; message: string; isValid: boolean;}>} True if the session is valid, false otherwise.
 */
export async function isSessionValid(
  session_token: string
): Promise<{ status: number; message: string; isValid: boolean }> {
  try {
    if (!session_token) {
      Logger({ status: "WARN", message: "Session token is required" });
      return {
        status: 400,
        message: "Session token is required",
        isValid: false,
      };
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
      return {
        status: 404,
        message: "Session token not found or invalid",
        isValid: false,
      };
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
    return {
      status: 500,
      message: "An error occurred while checking the session validity.",
      isValid: false,
    };
  }
}

/**
 * Creates a short link in the database.
 * @param {string} code - The short code.
 * @param {string} origin - The origin URL.
 * @param {string} user_id - The ID of the user creating the short link.
 * @returns {Promise<{status: number; message: string;}>} A status and message indicating success or failure.
 */
export async function createShort(
  code: string,
  origin: string,
  user_id: number
): Promise<{ status: number; message: string; shortUrl?: string }> {
  const sql = "INSERT INTO links (code, origin, user_id) VALUES (?, ?, ?)";
  const values = [code, origin, user_id];

  try {
    await new Promise<void>((resolve, reject) => {
      DB.query(sql, values, (err) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error while creating short link: ${err.message}`,
          });

          if (err.code === "ER_DUP_ENTRY") {
            reject({ status: 409, message: "Short code already exists" });
          } else {
            reject({ status: 500, message: "Unexpected error" });
          }
        } else {
          resolve();
        }
      });
    });

    const baseUrl = process.env.NEXT_PUBLIC_HOSTNAME || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${code}`;

    return {
      status: 201,
      message: "Short link created successfully",
      shortUrl,
    };
  } catch (err) {
    Logger({
      status: "ERROR",
      message: `Error in createShort: ${err}`,
    });
    return { status: 500, message: "Unexpected error" };
  }
}

/**
 * Deletes the short code entry from the database.
 *
 * @param {string} code - The code to remove from the database.
 * @returns {Promise<{ status: number; message: string}>} - A promise that resolves to an object containing the status code and a message.
 */
export async function deleteCode(
  code: string
): Promise<{ status: number; message: string }> {
  const sql = "DELETE FROM links WHERE code = ?";
  const values = [code];

  try {
    await new Promise<void>((resolve, reject) => {
      DB.query(sql, values, (err) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error while deleting short link: ${err.message}`,
          });
          reject({
            status: 500,
            message: `Error while deleting short link: ${err.message}`,
          });
        } else {
          resolve();
        }
      });
    });

    return { status: 200, message: "Code deleted successfully" };
  } catch (error) {
    return { status: 500, message: "Unexpected error" };
  }
}

/**
 * Queries the database for the user id using the session token
 * @param {string} token - Session Token
 * @returns {Promise<{ status: number; message: string; id: number | null }>}
 */
export async function getUserIdBySessionToken(
  token: string
): Promise<{ status: number; message: string; id: number | null }> {
  const sql = "SELECT id FROM users WHERE session_token = ?";
  const values = [token];

  try {
    const result = await new Promise<any[]>((resolve, reject) => {
      DB.query(sql, values, (err, res) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error executing query: ${err.message}`,
          });
          reject({ status: 500, message: "Unexpected error" });
        } else {
          resolve(res);
        }
      });
    });

    if (result.length === 0) {
      Logger({ status: "WARN", message: "User ID not found" });
      return { status: 404, message: "User ID not found", id: null };
    }

    return { status: 200, message: "User ID found", id: result[0].id };
  } catch (err) {
    Logger({
      status: "ERROR",
      message: `Error in getUserIdBySessionToken: ${err}`,
    });
    return { status: 500, message: "Unexpected error", id: null };
  }
}

/**
 * Queries the database for the URL using the short code of the pathname
 * @param {string} code - Short code from the page path
 * @returns {Promise<{ status: number; message: string; link: URL | null }>}
 */
export async function getLinkByCode(
  code: string
): Promise<{ status: number; message: string; origin: string | null }> {
  const sql = "SELECT origin FROM links WHERE code = ?";
  const values = [code];

  try {
    const result = await new Promise<any[]>((resolve, reject) => {
      DB.query(sql, values, (err, res) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error executing query: ${err.message}`,
          });
          reject({ status: 500, message: "Unexpected error", origin: null });
        } else {
          resolve(res);
        }
      });
    });

    if (result.length === 0) {
      Logger({ status: "WARN", message: "Link not found" });
      return { status: 404, message: "Link not found", origin: null };
    }

    return {
      status: 200,
      message: "Link found",
      origin: result[0].origin,
    };
  } catch (err) {
    Logger({
      status: "ERROR",
      message: `Error in getLinkByCode: ${err}`,
    });
    return { status: 500, message: "Unexpected error", origin: null };
  }
}

/**
 *
 * @param {string} code - Code of the shortened url
 * @returns {Promise<{ status: number; message: string;}>}
 */
export async function addClick(
  code: string
): Promise<{ status: number; message: string }> {
  const sql = "UPDATE links SET click_count = click_count + 1 WHERE code = ?";
  const values = [code];

  try {
    const result = await new Promise<any>((resolve, reject) => {
      DB.query(sql, values, (err, res) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `SQL error: ${JSON.stringify(err)}`,
          });
          reject({ status: 500, message: "Unexpected error" });
        } else {
          resolve(res);
        }
      });
    });

    if (result.affectedRows === 0) {
      Logger({ status: "WARN", message: "Link not found" });
      return { status: 404, message: "Link not found" };
    }

    return { status: 200, message: "Link found and updated" };
  } catch (error) {
    Logger({
      status: "ERROR",
      message: `Error in addClick: ${JSON.stringify(error)}`,
    });
    return { status: 500, message: "Unexpected error" };
  }
}

/**
 * Queries the database for links associated with a user ID
 * @param {number} userId - User ID
 * @returns {Promise<{ status: number; message: string; links?: Array<{ code: string; origin: string; click_count: number }> }>}
 */
export async function getCodesForUserId(userId: number): Promise<{
  status: number;
  message: string;
  links?: Array<{ code: string; origin: string; click_count: number }>;
}> {
  const sql = "SELECT code, origin, click_count FROM links WHERE user_id = ?";
  const values = [userId];

  try {
    const result = await new Promise<any[]>((resolve, reject) => {
      DB.query(sql, values, (err, res) => {
        if (err) {
          Logger({
            status: "ERROR",
            message: `Error executing query: ${err.message}`,
          });
          reject({ status: 500, message: "Unexpected error" });
        } else {
          resolve(res);
        }
      });
    });

    if (result.length === 0) {
      Logger({ status: "WARN", message: "No links found for the user" });
      return { status: 404, message: "No links found", links: [] };
    }

    return { status: 200, message: "Links found", links: result };
  } catch (err) {
    Logger({
      status: "ERROR",
      message: `Error in getCodesForUserId: ${err}`,
    });
    return { status: 500, message: "Unexpected error", links: [] };
  }
}
