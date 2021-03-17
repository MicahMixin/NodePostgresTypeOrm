const express = require("express");
const { auth } = require("../middleware/auth");

import { NextFunction, Request, Response } from "express";
import { sneakerController } from "../controller/sneakerController";

const router = new express.Router();

router.post(
  "/sneakers",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    sneakerController.addNewSneaker(req, res, next);
  }
);

router.get(
  "/sneakers/:id",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    sneakerController.getSneakerById(req, res, next);
  }
);

router.get(
  "/sneakers/",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    sneakerController.getSneaker(req, res, next);
  }
);

router.delete(
  "/sneakers/:id",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    sneakerController.deleteSneakerById(req, res, next);
  }
);

router.patch(
  "/sneakers/:id",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    sneakerController.updateSneakerById(req, res, next);
  }
);

module.exports = router;
