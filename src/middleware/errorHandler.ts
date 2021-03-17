import { NextFunction, Request, Response } from "express";
import { ERROR_CODES } from "../enum";
import { ApiResponse } from "../types";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorCode = err.statusCode ?? ERROR_CODES.HTTP_BAD_REQUEST;
  let response: ApiResponse = {
    success: false,
    data: {},
    error: err.message,
    version: "1.0.0",
  };

  res.status(errorCode).json(response);
};

module.exports = { errorHandler };
