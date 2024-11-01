// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import dotenv from 'dotenv';

dotenv.config();

type LoggerStatus = "ERROR" | "WARN" | "INFO" | "DEBUG";

interface LoggerProps {
  status: LoggerStatus;
  message: string;
}

const LOG_DIR = './logs';
const MAX_LOG_FILES = 7;
const LOG_EXTENSION = '.log';

/**
 * Ensure the log directory exists
 */
const ensureLogDirectoryExists = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
};

/**
 * Get the log file name for today
 */
const getLogFileName = () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `log-${today}${LOG_EXTENSION}`;
};

/**
 * Rotate logs: compress older logs into a zip file after 7 days
 */
const rotateLogs = () => {
  const files = fs.readdirSync(LOG_DIR).filter(file => file.endsWith(LOG_EXTENSION));
  
  if (files.length > MAX_LOG_FILES) {
    const oldestFiles = files.sort().slice(0, files.length - MAX_LOG_FILES);
    
    const zip = zlib.createGzip();
    const output = fs.createWriteStream(path.join(LOG_DIR, `logs-${new Date().toISOString().slice(0, 10)}.zip`));

    oldestFiles.forEach(file => {
      const filePath = path.join(LOG_DIR, file);
      const input = fs.createReadStream(filePath);
      input.pipe(zip).pipe(output);
      input.on('end', () => fs.unlinkSync(filePath));
    });
  }
};

/**
 * Logs a message to the console and a daily log file
 * @param {LoggerProps} props - Object that contains status and message string
 */
const Logger = ({ status, message }: LoggerProps): void => {
  ensureLogDirectoryExists();
  
  const currentDate = new Date().toISOString();
  const logMessage = `[${currentDate}] [${status}] ${message}\n`;

  let color = '';

  switch (status) {
    case 'ERROR':
      color = '\x1b[31m';
      break;
    case 'WARN':
      color = '\x1b[33m';
      break;
    case 'INFO':
      color = '\x1b[34m';
      break;
    case 'DEBUG':
      color = '\x1b[32m';
      break;
    default:
      color = '\x1b[0m';
  }

  if (process.env.DEBUG === 'true' || status === 'ERROR' || status === 'WARN') {
    console.log(`${color}[${currentDate}] [${status}] ${message}\x1b[0m`);
  }

  const logFile = path.join(LOG_DIR, getLogFileName());
  fs.appendFileSync(logFile, logMessage);

  fs.writeFileSync(path.join(LOG_DIR, 'latest.log'), logMessage);
  rotateLogs();
};

export default Logger;
