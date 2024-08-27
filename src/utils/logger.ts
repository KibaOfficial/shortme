// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import dotenv from "dotenv";

dotenv.config();

type LoggerStatus = "ERROR" | "WARN" | "INFO" | "DEBUG";

interface LoggerProps {
  status: LoggerStatus;
  message: string;
}

const Logger = ({ status, message }: LoggerProps): void => {
  if (process.env.DEBUG === "true") {
    const curretDate = new Date().toISOString();
    console.log(`[${curretDate}] [${status}] ${message}`);
  }
};

export default Logger;
