import { Sequelize } from "sequelize";
import { config } from "./config.js";

const { host, user, database, password, port } = config.db;

export const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
