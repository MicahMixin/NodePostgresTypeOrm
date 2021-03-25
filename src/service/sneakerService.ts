import { Sneaker } from "../entity/sneaker";
import { BaseService as BaseService } from "./baseService";
import { SneakerRepository } from "../repository/sneakerRepository";
import { catchError } from "../decorators/catchError";
import { getManager } from "typeorm";

export class SneakerService extends BaseService<SneakerRepository> {
  public async findOne(field: any) {
    return (await this.getRepository(SneakerRepository)).findOne(field);
  }

  public async save(sneaker: Sneaker) {
    return (await this.getRepository(SneakerRepository)).save(sneaker);
  }

  public async remove(sneaker: Sneaker) {
    return (await this.getRepository(SneakerRepository)).remove(sneaker);
  }

  public async find(relationType: string) {
    return (await this.getRepository(SneakerRepository)).find({
      relations: [relationType],
    });
  }

  @catchError
  public async transaction(sneakers: Sneaker[]) {
    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(sneakers);
    });
  }
}

export const sneakerService = new SneakerService();
