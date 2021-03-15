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
}
