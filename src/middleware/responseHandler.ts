import { NextFunction } from "express";
import { ApiResponse } from "../types";

export const responseHandler = (req: any, res: any, next: NextFunction) => {
  const oldSend = res.send;
  res.send = function (data) {
    res.send = oldSend;
    const isSuccess = Math.floor(res.statusCode / 100) === 2;
    const version = "1.0.0";
    const response: ApiResponse = {
      success: isSuccess,
      data: isSuccess ? data : "",
      error: isSuccess ? "" : data,
      version,
    };
    return res.send(response);
  };
  next();
};
