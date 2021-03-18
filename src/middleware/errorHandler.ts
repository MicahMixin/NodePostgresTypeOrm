import { NextFunction, Request, Response } from "express";
import { ERROR_CODES, ERROR_MESSAGES } from "../enum";

const errorHandler = (req: Request, res: Response, next: NextFunction) => {
  res.statusCode = ERROR_CODES.HTTP_BAD_REQUEST;
  res.send(ERROR_MESSAGES.HTTP_BAD_REQUEST);
};

module.exports = { errorHandler };
