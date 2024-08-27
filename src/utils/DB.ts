/* eslint-disable import/no-anonymous-default-export */
// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mysql from "mysql"

/**
 * A class to handle database connections and queries
*/
class Database {
  private connection: mysql.Connection;

  /**
   * Creates a new mysql connection using data from .env
  */
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }

  /**
   * Connects to the database
   * @param callback - called when the connection is complete
  */
  connect(callback: (err: mysql.MysqlError | null) => void) {
    this.connection.connect(callback);
  }

  /**
   * Executes a query on the database
   * @param sql - The sql query string
   * @param values - Values to instert into the query
   * @param callback - Called with the result of the query
  */
  query(sql: string, values: any[], callback: (err: mysql.MysqlError | null, result: any) => void) {
    this.connection.query(sql, values, callback);
  }
}

export default new Database();