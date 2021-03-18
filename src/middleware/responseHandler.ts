import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types";

const responseHandler = (req: any, res: any, next: NextFunction) => {
  let oldSend = res.send;
  res.send = function (data) {
    res.send = oldSend;
    const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
    const response: ApiResponse = {
      success: isSuccess,
      data: isSuccess ? data : "",
      error: isSuccess ? "" : data,
      version: "1.0.0",
    };
    return res.send(response);
  };
  next();
};

module.exports = { responseHandler };
