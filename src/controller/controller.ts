import { ValidationError, validate } from "class-validator";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { dbConnection } from "../postgres/db";

export class Controller {
  constructor() {}

  public async userRegister(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;
      let user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = password;
      const errors: ValidationError[] = await validate(user, {
        validationError: { target: false },
      });
      if (errors.length > 0) {
        return res.status(400).send(errors);
      }
      const userRepository = await dbConnection
        .getConnection()
        .getRepository(User);
      await userRepository.save(user);
      res.status(201).send("User created successfully");
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }

  public async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userRepository = await dbConnection
        .getConnection()
        .getRepository(User);
      let user = new User();
      user = await userRepository.findOne({ email });
      let correctPassword = false;
      if (user) {
        correctPassword = await user.comparePassword(password);
      }
      if (!user || !correctPassword) {
        return res.status(404).send("Invalid email or password");
      }
      const token = user.generateAuthToken();
      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }
}

export const controller = new Controller();
