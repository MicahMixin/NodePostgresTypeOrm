const express = require("express");
const { auth, getUser } = require("../middleware/auth");

import { Request, Response } from "express";
import { controller } from "../controller/controller";

const router = new express.Router();

router.post("/users", async (req: Request, res: Response) => {
  controller.userRegister(req, res);
});

router.post("/users/login", async (req: Request, res: Response) => {
  controller.userLogin(req, res);
});

router.get("/users/me", auth, async (req: Request, res: Response) => {
  getUser(req, res);
});

module.exports = router;
