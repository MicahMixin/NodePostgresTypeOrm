import { ValidationError, validate } from "class-validator";
import { Request, Response } from "express";
import { Sneaker } from "../entity/Sneaker";
import { sneakerRepository } from "../repository/sneaker";
const { errorHandler } = require("../middleware/errorHandler");
const { responseHandler } = require("../middleware/responseHandler");

export class SneakerController {
  public async addNewSneaker(req: Request, res: Response) {
    try {
      const { brand, type, model, year, shoeSize } = req.body;
      let sneaker = new Sneaker();
      sneaker.brand = brand;
      sneaker.model = model;
      sneaker.type = type;
      sneaker.year = year;
      sneaker.shoeSize = shoeSize;
      const errors: ValidationError[] = await validate(sneaker, {
        validationError: { target: false },
      });
      if (errors.length > 0) {
        const response = errorHandler(400, JSON.stringify(errors));
        return res.status(400).send(response);
      }
      await sneakerRepository.save(sneaker);
      const response = responseHandler("Sneaker created successfully");
      res.status(201).send(response);
    } catch (error) {
      const response = errorHandler(400);
      res.status(400).send(response);
    }
  }

  public async getSneakerById(req: Request, res: Response) {
    try {
      const sneaker: Sneaker = await sneakerRepository.findOne(req.params.id);
      if (!sneaker) {
        const response = errorHandler(404, "Sneaker not found");
        return res.status(404).send(response);
      }
      const { brand, model, type, year, shoeSize } = sneaker;
      const response = responseHandler({
        brand,
        model,
        type,
        year,
        shoeSize,
      });
      res.status(200).send(response);
    } catch (error) {
      const response = errorHandler(400);
      res.status(400).send(response);
    }
  }

  public async getSneaker(req: Request, res: Response) {
    const { params } = req.query;
    try {
      const sneaker: Sneaker = await sneakerRepository.findOne({ params });
      if (!sneaker) {
        const response = errorHandler(404, "Sneaker not found");
        return res.status(404).send(response);
      }
      const { brand, model, type, year, shoeSize } = sneaker;
      const response = responseHandler({
        brand,
        model,
        type,
        year,
        shoeSize,
      });
      res.status(200).send(response);
    } catch (error) {
      const response = errorHandler(400);
      res.status(400).send(response);
    }
  }

  public async deleteSneakerById(req: Request, res: Response) {
    try {
      const sneaker: Sneaker = await sneakerRepository.findOne(req.params.id);
      if (!sneaker) {
        const response = errorHandler(404, "Sneaker not found");
        return res.status(404).send(response);
      }
      await sneakerRepository.remove(sneaker);
      const response = responseHandler("Sneaker deleted sucessfully");
      return res.status(204).send(response);
    } catch (error) {
      const response = errorHandler(400);
      res.status(400).send(response);
    }
  }

  public async updateSneakerById(req: Request, res: Response) {
    try {
      const sneaker: Sneaker = await sneakerRepository.findOne(req.params.id);
      if (!sneaker) {
        const response = errorHandler(404, "Sneaker not found");
        return res.status(404).send(response);
      }
      const updates = Object.keys(req.body);
      const allowedUpdates = ["brand", "type", "model", "year", "shoeSize"];
      const isValidUpdate = updates.every((update) =>
        allowedUpdates.includes(update)
      );
      if (!isValidUpdate) {
        throw new Error();
      }
      try {
        updates.forEach((update) => (sneaker[update] = req.body[update]));
        await sneakerRepository.save(sneaker);
      } catch (error) {
        const response = errorHandler(500);
        res.status(500).send(response);
      }
      const response = responseHandler("Sneaker updated successfully");
      res.status(202).send(response);
    } catch (error) {
      const response = errorHandler(400);
      res.status(400).send(response);
    }
  }
}

export const sneakerController = new SneakerController();
