require("dotenv").config();

export const dbConfig = {
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
};
