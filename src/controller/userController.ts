import { ValidationError, validate } from "class-validator";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { ApiResponse } from "../types";
import { userRepository } from "../repository/user";
const jwt = require("jsonwebtoken");

export class UserController {
  constructor() {}

  private responseHandler(status: number, data: any, error: string = "") {
    let response: ApiResponse = {
      success: null,
      data: {},
      error: "",
      version: "1.0.0",
    };
    if (status >= 200 && status < 300) {
      response.success = true;
      response.data = data;
    } else {
      response.success = false;
      response.error = error;
    }
    return response;
  }

  public async userRegister(req: Request, res: Response) {
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
        const response = this.responseHandler(400, {}, JSON.stringify(errors));
        return res.status(400).send(response);
      }
      await userRepository.save(user);
      const response = this.responseHandler(
        201,
        {},
        "User created successfully"
      );
      res.status(201).send(response);
    } catch (error) {
      const response = this.responseHandler(400, {}, "Bad request");
      res.status(400).send(response);
    }
  }

  public async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user: User = await userRepository.findOne({ email });
      let correctPassword = false;
      if (user) {
        correctPassword = await user.comparePassword(password);
      }
      if (!user || !correctPassword) {
        const response = this.responseHandler(
          404,
          {},
          "Invalid email or password"
        );
        return res.status(404).send(response);
      }
      const token = user.generateAuthToken();
      const response = this.responseHandler(200, { token });
      return res.status(200).send(response);
    } catch (error) {
      const response = this.responseHandler(400, {}, "Bad request");
      res.status(400).send(response);
    }
  }

  public async userDetails(req: Request, res: Response) {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id, firstName, lastName, email } = decoded;
      const response = this.responseHandler(200, {
        id,
        firstName,
        lastName,
        email,
      });
      res.send(response);
    } catch (error) {
      const response = this.responseHandler(500, {}, "Server error");
      res.status(500).send(response);
    }
  }

  public async userById(req: Request, res: Response) {
    try {
      const user: User = await userRepository.findOne(req.params.id);
      if (!user) {
        const response = this.responseHandler(404, {}, "User not found");
        return res.status(404).send(response);
      }
      const { id, firstName, lastName, email } = user;
      const response = this.responseHandler(200, {
        id,
        firstName,
        lastName,
        email,
      });
      res.status(200).send(response);
    } catch (error) {
      const response = this.responseHandler(400, {}, "Bad request");
      res.status(400).send(response);
    }
  }

  public async deleteUserById(req: Request, res: Response) {
    try {
      const user: User = await userRepository.findOne(req.params.id);
      if (!user) {
        const response = this.responseHandler(404, {}, "User not found");
        return res.status(404).send(response);
      }
      await userRepository.remove(user);
      const response = this.responseHandler(204, {});
      return res.status(204).send(response);
    } catch (error) {
      const response = this.responseHandler(400, {}, "Bad request");
      res.status(400).send(response);
    }
  }

  public async updateUserById(req: any, res: Response) {
    try {
      const user: User = await userRepository.findOne(req.params.id);
      if (!user) {
        const response = this.responseHandler(404, {}, "User not found");
        return res.status(404).send(response);
      }
      const updates = Object.keys(req.body);
      const allowedUpdates = ["firstName", "lastName", "password", "email"];
      const isValidUpdate = updates.every((update) =>
        allowedUpdates.includes(update)
      );
      if (!isValidUpdate) {
        throw new Error();
      }
      try {
        updates.forEach((update) => (user[update] = req.body[update]));
        await userRepository.save(user);
      } catch (error) {
        const response = this.responseHandler(500, {}, "Server Error");
        res.status(500).send(response);
      }
      const response = this.responseHandler(202, "User updated successfully");
      res.status(202).send(response);
    } catch (error) {
      const response = this.responseHandler(400, {}, "Bad request");
      res.status(400).send(response);
    }
  }
}

export const userController = new UserController();
