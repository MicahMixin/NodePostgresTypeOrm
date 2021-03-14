import { Request, Response } from "express";
import { ApiResponse } from "../types";

const responseHandler = (req: Request, res: Response, next) => {
  const version = "1.0.0";
  const success = res.statusCode >= 200 && res.statusCode < 300;
  const response: ApiResponse = {
    success,
    data: success ? res : {},
    error: !success ? res : {},
    version,
  };
  res.send(response);
};

module.exports = { responseHandler };
