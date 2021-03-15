const express = require("express");
const { auth } = require("../middleware/auth");

import { Request, Response } from "express";
import { sneakerController } from "../controller/sneakerController";

const router = new express.Router();

router.post("/sneakers", auth, async (req: Request, res: Response) => {
  sneakerController.addNewSneaker(req, res);
});

router.get("/sneakers/:id", auth, async (req: Request, res: Response) => {
  sneakerController.getSneakerById(req, res);
});

router.get("/sneakers/", auth, async (req: Request, res: Response) => {
  sneakerController.getSneaker(req, res);
});

router.delete("/sneakers/:id", auth, async (req: Request, res: Response) => {
  sneakerController.deleteSneakerById(req, res);
});

router.patch("/sneakers/:id", auth, async (req: Request, res: Response) => {
  sneakerController.updateSneakerById(req, res);
});

module.exports = router;
