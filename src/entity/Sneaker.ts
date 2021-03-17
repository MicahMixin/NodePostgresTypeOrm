import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsAlpha, IsNumber } from "class-validator";
import { User } from "./User";

@Entity()
export class Sneaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsAlpha()
  brand: string;

  @Column()
  @IsAlpha()
  type: string;

  @Column()
  @IsAlpha()
  model: string;

  @Column()
  @IsAlpha()
  year: string;

  @Column()
  @IsNumber()
  shoeSize: number;

  @ManyToOne(() => User, (user) => user.sneakers)
  user: User;

  canUpdate(field: string) {
    return (
      field === "brand" ||
      field === "type" ||
      field === "model" ||
      field === "shoeSize"
    );
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
