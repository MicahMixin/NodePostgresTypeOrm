import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types";

const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  const { code, data } = res["response"];
  let response: ApiResponse = {
    success: true,
    data: data,
    error: "",
    version: "1.0.0",
  };
  res.status(code).json(response);
};

module.exports = { responseHandler };
