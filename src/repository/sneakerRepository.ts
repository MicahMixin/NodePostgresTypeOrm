import { Sneaker } from "../entity/sneaker";
import { BaseRepository } from "./baseRepository";

export class SneakerRepository extends BaseRepository<Sneaker> {
  public async findOne(field: any) {
    return (await this.getRepository(Sneaker)).findOne(field);
  }

  public async save(sneaker: Sneaker) {
    return (await this.getRepository(Sneaker)).save(sneaker);
  }

  public async remove(sneaker: Sneaker) {
    return (await this.getRepository(Sneaker)).remove(sneaker);
  }

  public async find(relationType: string) {
    return (await this.getRepository(Sneaker)).find({
      relations: [relationType],
    });
  }
}

export const sneakerRepository = new SneakerRepository();
