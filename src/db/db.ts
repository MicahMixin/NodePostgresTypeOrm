import { Connection, createConnection } from "typeorm";
import { dbConfig } from "../config/dbConfig";
import { Sneaker } from "../entity/Sneaker";
import { User } from "../entity/User";

export class db {
  private connection: Connection = null;

  constructor() {
    this.setupConnection();
  }

  public getConnection() {
    return this.connection;
  }

  setupConnection = () => {
    createConnection({
      type: "postgres",
      host: "localhost",
      port: dbConfig.port,
      username: "postgres",
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User, Sneaker],
      synchronize: true,
      logging: false,
    })
      .then((connection: Connection) => {
        console.log("connected to POSTGRES (burp) ספרגטסופ");
        // here you can start to work with your entities
        this.connection = connection;
      })
      .catch((error) => {
        return error;
      });
  };
}

export const dbConnection = new db();
