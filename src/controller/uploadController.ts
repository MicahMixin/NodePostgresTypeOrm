import { Request, Response, NextFunction } from "express";
import * as sharp from "sharp";

export class UploadController {
  public async uploadMedia(req: any, res: Response, next: NextFunction) {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  }
}
