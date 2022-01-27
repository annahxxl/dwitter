import mysql from "mysql2";
import { Sequelize } from "sequelize";
import { config } from "./config.js";

const { host, user, database, password } = config.db;

export const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: "mysql",
});

const pool = mysql.createPool({
  host,
  user,
  database,
  password,
});

export const db = pool.promise();
