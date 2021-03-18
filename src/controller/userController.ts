import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { catchError } from "../decorators/catchError";
import { Sneaker } from "../entity/Sneaker";
import { User } from "../entity/User";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";
import { sneakerRepository } from "../repository/sneaker";
import { userRepository } from "../repository/user";
import { ServerError } from "../serverError";

export class UserController {
  @catchError
  public async userRegister(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, sneakers } = req.body;
    let user = new User(firstName, lastName, email, password, sneakers);
    const errors: ValidationError[] = await validate(user, {
      validationError: { target: false },
    });
    if (errors.length) {
      throw new ServerError(
        ERROR_CODES.HTTP_BAD_REQUEST,
        ERROR_MESSAGES.HTTP_BAD_REQUEST
      );
    }
    console.log(user);
    await userRepository.save(user);
    res.statusCode = 201;
    res.send("User created successfully");
  }

  @catchError
  public async userLogin(req: Request, res: Response, next: any) {
    const { email, password } = req.body;
    const user: User = await userRepository.findOne({ email });
    let correctPassword = false;
    if (user) {
      correctPassword = await user.comparePassword(password);
    }
    if (!user || !correctPassword) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const token = user.generateAuthToken();
    res.statusCode = 200;
    res.send({ token });
  }

  @catchError
  public async userById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const user: User = await userRepository.findOne(userId);
    const sneakers = await sneakerRepository.find("user");
    if (!user) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { id, firstName, lastName, email } = user;
    res.statusCode = 200;
    res.send({
      user: {
        id,
        firstName,
        lastName,
        email,
        sneakers,
      },
    });
  }

  @catchError
  public async userDetails(req: Request, res: Response, next: NextFunction) {
    const { id, firstName, lastName, email, sneakers } = req["user"];
    const userResponse = { user: { id, firstName, lastName, email, sneakers } };
    res.statusCode = 200;
    res.send(userResponse);
  }

  @catchError
  public async deleteUserById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const user: User = await userRepository.findOne(userId);
    if (!user) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    await userRepository.remove(user);
    res.statusCode = 204;
    res.send("User deleted successfully");
  }

  @catchError
  public async updateUserById(req: any, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const user: User = await userRepository.findOne(userId);
    if (!user) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const updates = Object.keys(req.body);
    updates.forEach((field) => {
      if (user.canUpdate(field)) {
        user[field] = req.body[field];
      } else {
        throw new ServerError(
          ERROR_CODES.HTTP_BAD_REQUEST,
          `${[field]} field does not exist`
        );
      }
    });
    if (updates.includes("sneakers")) {
      user.sneakers.forEach(async (sneaker: any) => {
        const { brand, model, type, year, shoeSize } = sneaker;
        const userSneaker = new Sneaker(brand, model, type, year, shoeSize);
        await sneakerRepository.save(userSneaker);
      });
    }
    await userRepository.save(user);
    res.statusCode = 202;
    res.send("User updated successfully");
  }
}

export const userController = new UserController();
