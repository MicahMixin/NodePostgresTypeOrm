import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { catchError } from "../decorators/catchError";
import { Sneaker } from "../entity/sneaker";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";
import { sneakerService } from "../service/sneakerService";
import { ServerError } from "../serverError";
import { HttpResponse } from "../interfaces/responseInterface";
import { userService } from "../service/userService";

export class SneakerController {
  @catchError
  public async addNewSneaker(req: Request, res: Response, next: NextFunction) {
    const { brand, type, model, year, shoeSize, user } = req.body;
    let sneaker = new Sneaker(brand, type, model, year, shoeSize, user);
    const errors: ValidationError[] = await validate(sneaker, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      throw new ServerError(
        ERROR_CODES.HTTP_BAD_REQUEST,
        ERROR_MESSAGES.HTTP_BAD_REQUEST
      );
    }
    await sneakerService.save(sneaker);
    const response: HttpResponse = {
      statusCode: 201,
      data: "Sneaker created successfully",
    };
    return response;
  }

  @catchError
  public async getSneakerById(req: Request, res: Response, next: NextFunction) {
    const sneakerId = parseInt(req.params.id);
    const sneaker: Sneaker = await sneakerService.findOne(sneakerId);
    const users = await userService.find("sneakers");
    const user = users[0];
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { id, brand, model, type, year, shoeSize } = sneaker;
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const response: HttpResponse = {
      statusCode: 200,
      data: {
        id,
        brand,
        model,
        type,
        year,
        shoeSize,
        user: userResponse,
      },
    };
    return response;
  }

  @catchError
  public async getSneaker(req: any, res: Response, next: NextFunction) {
    const { params } = req.query;
    const searchParams = params.split(":");
    const field = searchParams[0];
    const value = searchParams[1];

    const sneaker: Sneaker = await sneakerService.findOne({
      [field]: value,
    });
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { id, brand, model, type, year, shoeSize, user } = sneaker;
    const { firstName, lastName, email } = user;
    const userResponse = {
      id: user.id,
      firstName,
      lastName,
      email,
    };
    const response: HttpResponse = {
      statusCode: 200,
      data: {
        id,
        brand,
        model,
        type,
        year,
        shoeSize,
        user: userResponse,
      },
    };
    return response;
  }

  @catchError
  public async deleteSneakerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const sneakerId = parseInt(req.params.id);
    const sneaker: Sneaker = await sneakerService.findOne(sneakerId);
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    await sneakerService.remove(sneaker);
    const response: HttpResponse = {
      statusCode: 204,
      data: "Sneaker deleted successfully",
    };
    return response;
  }

  @catchError
  public async updateSneakerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const sneakerId = parseInt(req.params.id);
    const sneaker: Sneaker = await sneakerService.findOne(sneakerId);
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const updates = Object.keys(req.body);
    updates.forEach((field) => {
      if (sneaker.canUpdate(field)) {
        sneaker[field] = req.body[field];
      } else {
        throw new ServerError(
          ERROR_CODES.HTTP_BAD_REQUEST,
          `${[field]} field does not exist`
        );
      }
    });
    await sneakerService.save(sneaker);
    const response: HttpResponse = {
      statusCode: 204,
      data: "Sneaker updated successfully",
    };
    return response;
  }
}

export const sneakerController = new SneakerController();
