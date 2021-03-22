import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { catchError } from "../decorators/catchError";
import { Sneaker } from "../entity/sneaker";
import { User } from "../entity/user";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";
import { sneakerService } from "../service/sneakerService";
import { userService } from "../service/userService";
import { ServerError } from "../serverError";
import { HttpResponse } from "../interfaces/responseInterface";

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
    await userService.save(user);
    const response: HttpResponse = {
      statusCode: 201,
      data: "User created successfully",
    };
    return response;
  }

  @catchError
  public async userLogin(req: Request, res: Response, next: any) {
    const { email, password } = req.body;
    const user: User = await userService.findOne({ email });
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
    const response: HttpResponse = {
      statusCode: 200,
      data: { token },
    };
    return response;
  }

  @catchError
  public async userById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const user: User = await userService.findOne(userId);
    const sneakers = await sneakerService.find("user");
    if (!user) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { id, firstName, lastName, email } = user;
    const response: HttpResponse = {
      statusCode: 200,
      data: {
        user: {
          id,
          firstName,
          lastName,
          email,
          sneakers,
        },
      },
    };
    return response;
  }

  @catchError
  public async userDetails(req: Request, res: Response, next: NextFunction) {
    const { id, firstName, lastName, email, sneakers } = req["user"];
    const userResponse = { user: { id, firstName, lastName, email, sneakers } };
    const response: HttpResponse = {
      statusCode: 200,
      data: userResponse,
    };
    return response;
  }

  @catchError
  public async deleteUserById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const user: User = await userService.findOne(userId);
    if (!user) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    await userService.remove(user);
    const response: HttpResponse = {
      statusCode: 204,
      data: "User deleted successfully",
    };
    return response;
  }

  @catchError
  public async addSneakersForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = parseInt(req.params.id);
    const user: User = await userService.findOne(userId);
    if (!user) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const updates = Object.keys(req.body);
    if (updates.includes("sneakers")) {
      const sneakersArr: any = [];
      const { sneakers } = req.body;
      sneakers.forEach(async (sneaker: any) => {
        const { brand, model, type, year, shoeSize } = sneaker;
        const userSneaker = new Sneaker(brand, model, type, year, shoeSize);
        sneakersArr.push(userSneaker);
      });
      await sneakerService.transaction(sneakersArr);
    }
    const response: HttpResponse = {
      statusCode: 202,
      data: "Sneakers added to user successfully",
    };
    return response;
  }

  @catchError
  public async updateUserById(req: any, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const user: User = await userService.findOne(userId);
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
        await sneakerService.save(userSneaker);
      });
    }
    await userService.save(user);
    const response: HttpResponse = {
      statusCode: 202,
      data: "User updated successfully",
    };
    return response;
  }
}

export const userController = new UserController();
