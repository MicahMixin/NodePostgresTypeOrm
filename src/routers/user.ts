const express = require("express");
const { auth } = require("../middleware/auth");

import { Request, Response } from "express";
import { userController } from "../controller/userController";

const router = new express.Router();

router.post("/users", async (req: Request, res: Response) => {
  userController.userRegister(req, res);
});

router.post("/users/login", async (req: Request, res: Response, next: any) => {
  userController.userLogin(req, res);
});

router.get("/users/me", auth, async (req: Request, res: Response) => {
  userController.userDetails(req, res);
});

router.get("/users/:id", auth, async (req: any, res: Response) => {
  userController.userById(req, res);
});

router.delete("/users/:id", auth, async (req: any, res: Response) => {
  userController.deleteUserById(req, res);
});

router.patch("/users/:id", auth, async (req: any, res: Response) => {
  userController.updateUserById(req, res);
});

module.exports = router;
