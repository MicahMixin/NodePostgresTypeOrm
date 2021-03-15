const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { MinLength, IsEmail, IsAlpha } from "class-validator";
import { UserRO } from "../types";
import { Sneaker } from "./Sneaker";

const SALT = 8;

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsAlpha()
  firstName: string;

  @Column()
  @IsAlpha()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @OneToMany(() => Sneaker, (sneaker) => sneaker.user)
  sneakers: Sneaker[];

  @Column()
  @MinLength(8, {
    message: "Password is too short. Minimal length is $constraint1 characters",
  })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    // conditional to detect if password has changed goes here
    this.password = bcrypt.hashSync(this.password, SALT);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compareSync(attempt, this.password);
  }

  toResponseObject(): UserRO {
    const { id, firstName, lastName, email } = this;
    const responseObject: UserRO = {
      id,
      firstName,
      lastName,
      email,
    };

    return responseObject;
  }

  generateAuthToken() {
    const token = jwt.sign(this.toResponseObject(), process.env.JWT_SECRET);
    return token;
  }
}
