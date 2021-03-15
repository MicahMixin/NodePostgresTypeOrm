import { User } from "../entity/User";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<User> {
  public async findOne(field: any) {
    return (await this.getRepository(User)).findOne(field);
  }

  public async save(user: User) {
    return (await this.getRepository(User)).save(user);
  }

  public async remove(user: User) {
    return (await this.getRepository(User)).remove(user);
  }
}

export const userRepository = new UserRepository();
