const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";
import { userRepository } from "../repository/user";

const auth = async (req: Request, res: Response, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findOne({ id: decoded.id });
    if (!user) {
      next({
        statusCode: ERROR_CODES.HTTP_NOT_FOUND,
        message: ERROR_MESSAGES.HTTP_NOT_FOUND,
      });
    }
    req["user"] = user;
    next();
  } catch (error) {
    next({
      statusCode: ERROR_CODES.HTTP_UNAUTHORIZED,
      message: ERROR_MESSAGES.HTTP_UNAUTHORIZED,
    });
  }
};

module.exports = { auth };
