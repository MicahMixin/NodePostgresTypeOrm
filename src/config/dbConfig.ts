require("dotenv").config();

export const dbConfig = {
  port: Number(process.env.DB_PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};
