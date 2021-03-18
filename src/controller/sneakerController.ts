import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { catchError } from "../decorators/catchError";
import { Sneaker } from "../entity/Sneaker";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";
import { sneakerRepository } from "../repository/sneaker";
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
    res["response"] = { code: 201, data: "Sneaker created successfully" };
    next();
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
    const { brand, model, type, year, shoeSize } = sneaker;
    res["response"] = {
      code: 200,
      data: {
        brand,
        model,
        type,
        year,
        shoeSize,
      },
    };
    next();
  }

  @catchError
  public async getSneaker(req: Request, res: Response, next: NextFunction) {
    const { params } = req.query;
    const sneaker: Sneaker = await sneakerRepository.findOne({ params });
    if (!sneaker) {
      throw new ServerError(
        ERROR_CODES.HTTP_NOT_FOUND,
        ERROR_MESSAGES.HTTP_NOT_FOUND
      );
    }
    const { brand, model, type, year, shoeSize } = sneaker;
    res["response"] = {
      code: 200,
      data: {
        brand,
        model,
        type,
        year,
        shoeSize,
      },
    };
    next();
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
    res["response"] = {
      code: 204,
      data: "Sneaker deleted successfully",
    };
    next();
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
    res["response"] = {
      code: 204,
      data: "Sneaker updated successfully",
    };
    next();
  }
}

export const sneakerController = new SneakerController();
