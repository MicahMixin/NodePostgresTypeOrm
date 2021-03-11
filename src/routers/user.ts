const express = require("express");
const { User } = require("../entity/User");
const { auth, getUser } = require("../middleware/auth");

import { Request, Response } from "express";
import { validate, ValidationError } from "class-validator";
import { dbConnection } from "../postgres/db";

const router = new express.Router();

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    const errors: ValidationError[] = await validate(user, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    const userRepository = await dbConnection
      .getConnection()
      .getRepository(User);
    await userRepository.save(user);
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

router.post("/users/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRepository = await dbConnection
      .getConnection()
      .getRepository(User);
    let user = new User();
    user = await userRepository.findOne({ email });
    let correctPassword = false;
    if (user) {
      correctPassword = user.comparePassword(password);
    }
    if (!user || !correctPassword) {
      return res.status(404).send("Invalid email or password");
    }
    const token = user.generateAuthToken();
    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

router.get("/users/me", auth, async (req: Request, res: Response) => {
  getUser(req, res);
});

module.exports = router;
