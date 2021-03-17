import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { catchError } from "../decorators/catchError";
import { User } from "../entity/User";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";
import { userRepository } from "../repository/user";
import { ServerError } from "../serverError";

export class UserController {
  @catchError
  public async userRegister(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    let user = new User(firstName, lastName, email, password);
    const errors: ValidationError[] = await validate(user, {
      validationError: { target: false },
    });
    if (errors.length) {
      throw new ServerError(
        ERROR_CODES.HTTP_BAD_REQUEST,
        ERROR_MESSAGES.HTTP_BAD_REQUEST
      );
    }
    await userRepository.save(user);
    res["response"] = { code: 201, data: "User created successfully" };
    next();
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
    res["response"] = {
      code: 200,
      data: { token },
    };
    next();
  }

  @catchError
  public async userById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const user: User = await userRepository.findOne(userId);

    if (!user) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { id, firstName, lastName, email } = user;
    res["response"] = {
      code: 200,
      data: {
        user: {
          id,
          firstName,
          lastName,
          email,
        },
      },
    };
    next();
  }

  @catchError
  public async userDetails(req: Request, res: Response, next: NextFunction) {
    const { id, firstName, lastName, email } = req["user"];
    const userResponse = { user: { id, firstName, lastName, email } };
    res["response"] = {
      code: 200,
      data: userResponse,
    };
    next();
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
    res["response"] = {
      code: 204,
      data: "User deleted successfully",
    };
    next();
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
    await userRepository.save(user);
    res["response"] = {
      code: 202,
      data: "User updated successfully",
    };
    next();
  }
}

export const userController = new UserController();
