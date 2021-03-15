import { Repository, EntityTarget } from "typeorm";
import { dbConnection } from "../db/db";

export class BaseRepository<T> {
  private _repository: Repository<T>;

  protected async getRepository(
    entity: EntityTarget<T>
  ): Promise<Repository<T>> {
    if (!this._repository) {
      this._repository = await dbConnection
        .getConnection()
        .getRepository(entity);
    }
    return this._repository;
  }
}
