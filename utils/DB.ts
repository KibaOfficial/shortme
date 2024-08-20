/* eslint-disable import/no-anonymous-default-export */
// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mysql from "mysql"

class Database {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }

  connect(callback: (err: mysql.MysqlError | null) => void) {
    this.connection.connect(callback);
  }

  query(sql: string, values: any[], callback: (err: mysql.MysqlError | null, result: any) => void) {
    this.connection.query(sql, values, callback);
  }
}

export default new Database();