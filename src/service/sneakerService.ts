import { Sneaker } from "../entity/sneaker";
import { BaseService as BaseService } from "./baseService";
import { SneakerRepository } from "../repository/sneakerRepository";
import { getConnection } from "typeorm";
import { HttpResponse } from "../interfaces/responseInterface";
import { ERROR_CODES } from "../enum";
import { catchError } from "../decorators/catchError";

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
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      Promise.all(sneakers).then(async (values) => {
        await queryRunner.manager.save(sneakers);
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const response: HttpResponse = {
        statusCode: Number(ERROR_CODES.HTTP_BAD_REQUEST),
        data: error,
      };
      return response;
    } finally {
      await queryRunner.release();
    }
  }
}

export const sneakerService = new SneakerService();
