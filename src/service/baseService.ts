import { ObjectType } from "typeorm";
import { dbConnection } from "../db/db";

export class BaseService<T> {
  private _repository: T;

  protected async getRepository(customRepository: ObjectType<T>): Promise<T> {
    if (!this._repository) {
      this._repository = await dbConnection
        .getConnection()
        .getCustomRepository(customRepository);
    }
    return this._repository;
  }
}
