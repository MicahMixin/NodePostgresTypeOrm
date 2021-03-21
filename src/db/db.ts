import { Connection, createConnection } from "typeorm";
import { dbConfig } from "../config/dbConfig";
import { Sneaker } from "../entity/sneaker";
import { User } from "../entity/user";

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
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User, Sneaker],
      synchronize: true,
      logging: false,
    })
      .then((connection: Connection) => {
        console.log("connected to POSTGRES (burp) ספערגטסופ");
        // here you can start to work with your entities
        this.connection = connection;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
}

export const dbConnection = new db();
