import { Connection, createConnection } from "typeorm";
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
      port: 5432,
      username: "postgres",
      password: "root",
      database: "sneakers",
      entities: [User],
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
