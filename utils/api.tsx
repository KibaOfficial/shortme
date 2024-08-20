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

// Utils
import DB from "./DB";

const PRIV_KEY_FILE = "./data/key.pem";
const PUB_KEY_FILE = "./data/public.pem";
const PRIV_KEY = fs.readFileSync(PRIV_KEY_FILE, { encoding: "ascii" });
const PUB_KEY = fs.readFileSync(PUB_KEY_FILE, { encoding: "ascii" });

const SESSION_VALID_TIME_MS = 1000 * 60 * 60; // 1h

DB.connect((err) => {
  if (err) {
    console.error(`Could not connect to database: ${err}`);
  } else {
    console.log("Connected to database");
  }
});

async function Register(username: string, password: string) {
  try {
    if (!username || !password) {
      return { status: 400, message: "Username and password are required" };
    }

    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    const values = [username, hash];

    await new Promise<void>((resolve, reject) => {
      DB.query(sql, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return { status: 201, message: "User registered successfully" };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "An error occurred while registering the user",
    };
  }
}


async function Login(username: string, password: string) {
  try {
    if (!username || !password) {
      return { status: 400, message: "Username and password are required" };
    }

    const sql = "SELECT username, password, session_token FROM users WHERE username = ?";
    const result: any[] = await new Promise<any[]>((resolve, reject) => {
      DB.query(sql, [username], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    console.log(`Database result: ${JSON.stringify(result)}`); // Debugging Log

    if (!result || result.length === 0) {
      return { status: 404, message: "User not found" };
    }

    const user = result[0];
    if (!user.password) {
      return { status: 500, message: "User data is missing" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 401, message: "Invalid password" };
    }

    const token = jwt.sign(
      { userid: user.username },
      PRIV_KEY,
      {
        algorithm: "RS256",
        expiresIn: SESSION_VALID_TIME_MS / 1000,
      }
    );

    const updateSql = "UPDATE users SET session_token = ? WHERE username = ?";
    await new Promise<void>((resolve, reject) => {
      DB.query(updateSql, [token, username], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return { status: 200, message: "Login successful", token };
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: 500,
      message: "An error occurred while logging in",
    };
  }
}

async function validateSession(username: string, sessionToken: string) {
  try {
    if (!username || !sessionToken) {
      return false;
    }

    const sql = "SELECT session_token FROM users WHERE username = ?";
    const [result]: any = await new Promise<any>((resolve, reject) => {
      DB.query(sql, [username], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    if (result.length === 0) {
      return false;
    }

    const user = result[0];
    if (user.session_token !== sessionToken) {
      return false;
    }

    // Verify token validity
    try {
      jwt.verify(sessionToken, PRIV_KEY, { algorithms: ['RS256'] });
      return true;
    } catch (err) {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getUserBySessionToken (token: string): Promise<string | null> {
  const sql = "SELECT username FROM users WHERE session_token = ?";
  const values = [token];

  return new Promise((resolve, reject) => {
    DB.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else if (result.length === 0) {
        resolve(null);
      } else {
        resolve(result[0].username);
      }
    });
  });
}


export { Register, Login, validateSession, getUserBySessionToken};