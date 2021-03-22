import { EntityRepository, Repository } from "typeorm";
import { Sneaker } from "../entity/sneaker";

@EntityRepository(Sneaker)
export class SneakerRepository extends Repository<Sneaker> {}
