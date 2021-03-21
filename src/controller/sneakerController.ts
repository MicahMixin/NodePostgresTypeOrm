import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { catchError } from "../decorators/catchError";
import { Sneaker } from "../entity/sneaker";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";
import { sneakerRepository } from "../repository/sneakerRepository";
import { ServerError } from "../serverError";

export class SneakerController {
  @catchError
  public async addNewSneaker(req: Request, res: Response, next: NextFunction) {
    const { brand, type, model, year, shoeSize } = req.body;
    let sneaker = new Sneaker(brand, type, model, year, shoeSize);
    const errors: ValidationError[] = await validate(sneaker, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      throw new ServerError(
        ERROR_CODES.HTTP_BAD_REQUEST,
        ERROR_MESSAGES.HTTP_BAD_REQUEST
      );
    }
    await sneakerRepository.save(sneaker);
    res.statusCode = 201;
    res.send("Sneaker created successfully");
  }

  @catchError
  public async getSneakerById(req: Request, res: Response, next: NextFunction) {
    const sneakerId = parseInt(req.params.id);
    const sneaker: Sneaker = await sneakerRepository.findOne(sneakerId);
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { id, brand, model, type, year, shoeSize } = sneaker;
    return {
      statusCode: 200,
      data: {
        id,
        brand,
        model,
        type,
        year,
        shoeSize,
      },
    };
  }

  @catchError
  public async getSneaker(req: any, res: Response, next: NextFunction) {
    const { params } = req.query;
    const searchParams = params.split(":");
    const field = searchParams[0];
    const value = searchParams[1];

    const sneaker: Sneaker = await sneakerRepository.findOne({
      [field]: value,
    });
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { id, brand, model, type, year, shoeSize } = sneaker;
    res.statusCode = 200;
    res.send({
      id,
      brand,
      model,
      type,
      year,
      shoeSize,
    });
  }

  @catchError
  public async deleteSneakerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const sneakerId = parseInt(req.params.id);
    const sneaker: Sneaker = await sneakerRepository.findOne(sneakerId);
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    await sneakerRepository.remove(sneaker);
    res.statusCode = 204;
    res.send("Sneaker deleted successfully");
  }

  @catchError
  public async updateSneakerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const sneakerId = parseInt(req.params.id);
    const sneaker: Sneaker = await sneakerRepository.findOne(sneakerId);
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
    await sneakerRepository.save(sneaker);
    res.statusCode = 204;
    res.send("Sneaker updated successfully");
  }
}

export const sneakerController = new SneakerController();
