import { User } from "../entity/user";
import { BaseService as BaseService } from "./baseService";
import { UserRepository } from "../repository/userRepository";

export class UserService extends BaseService<UserRepository> {
  public async findOne(field: any) {
    return (await this.getRepository(UserRepository)).findOne(field);
  }

  public async save(user: User) {
    return (await this.getRepository(UserRepository)).save(user);
  }

  public async remove(user: User) {
    return (await this.getRepository(UserRepository)).remove(user);
  }

  public async find(relationType: string) {
    return (await this.getRepository(UserRepository)).find({
      relations: [relationType],
    });
  }
}

export const userService = new UserService();
