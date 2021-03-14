import { Repository } from "typeorm";
import { dbConnection } from "../db/db";
import { User } from "../entity/User";

export class UserRepository {
  public async getRepository() {
    return await dbConnection.getConnection().getRepository(User);
  }

  public async findOne(field: any) {
    const userRepo = await dbConnection.getConnection().getRepository(User);
    return await userRepo.findOne(field);
  }

  public async save(user: User) {
    const userRepo = await dbConnection.getConnection().getRepository(User);
    return await userRepo.save(user);
  }

  public async remove(user: User) {
    const userRepo = await dbConnection.getConnection().getRepository(User);
    return await userRepo.remove(user);
  }
}

export const userRepository = new UserRepository();
