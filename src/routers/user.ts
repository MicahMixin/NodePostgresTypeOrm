const express = require("express");
const { auth } = require("../middleware/auth");

import { NextFunction, Request, Response } from "express";
import { userController } from "../controller/userController";

const router = new express.Router();

router.get(
  "/users/me",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    userController.userDetails(req, res, next);
  },
  responseHandler
);

router.post(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    userController.userRegister(req, res, next);
  }
);

router.post(
  "/users/login",
  (req: Request, res: Response, next: NextFunction) => {
    userController.userLogin(req, res, next);
  }
);

router.get(
  "/users/:id(\\d+)",
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    userController.userById(req, res, next);
  }
);

router.delete(
  "/users/:id(\\d+)",
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    userController.deleteUserById(req, res, next);
  }
);

router.patch(
  "/users/:id(\\d+)",
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    userController.updateUserById(req, res, next);
  }
);

module.exports = router;
function responseHandler(
  arg0: string,
  auth: any,
  arg2: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  responseHandler: any
) {
  throw new Error("Function not implemented.");
}
