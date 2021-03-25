import { Request, Response, NextFunction } from "express";
import { catchError } from "../decorators/catchError";
import { HttpResponse } from "../interfaces/responseInterface";

export class UploadController {
  @catchError
  public async uploadMedia(req: any, res: Response, next: NextFunction) {
    const response: HttpResponse = {
      statusCode: 200,
      data: req.file.path,
    };
    return response;
  }
}

export const uploadController = new UploadController();
