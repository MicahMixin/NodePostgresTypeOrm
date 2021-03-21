import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsAlpha, IsAlphanumeric, IsNumber } from "class-validator";
import { User } from "./user";

@Entity()
export class Sneaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsAlphanumeric()
  brand: string;

  @Column()
  @IsAlphanumeric()
  type: string;

  @Column()
  @IsAlphanumeric()
  model: string;

  @Column()
  @IsNumber()
  year: string;

  @Column()
  @IsNumber()
  shoeSize: number;

  @ManyToOne((type) => User, (user) => user.sneakers)
  user: User;

  canUpdate(field: string) {
    return ["brand", "type", "year", "model", "shoeSize"].includes(field);
  }

  constructor(
    brand: string,
    type: string,
    model: string,
    year: string,
    shoeSize: number
  ) {
    this.brand = brand;
    this.type = type;
    this.model = model;
    this.year = year;
    this.shoeSize = shoeSize;
  }
}
