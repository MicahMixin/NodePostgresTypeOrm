import { Request, Response } from "express";
import * as multer from "multer";
import * as path from "path";
import { ERROR_CODES } from "../enum";
import { logger } from "./logger";
require("dotenv").config();

const FILE_SIZE_LIMIT = 1000000;

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DEST);
  },
});

const uploadMulter = multer({
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      logger.log({
        level: "error",
        message: `File must be an image`,
      });
      return cb(new Error("File must be an image"));
    }
    cb(undefined, true);
  },
  storage,
}).single("img");

export const upload = async (req: Request, res: Response, next) => {
  uploadMulter(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.statusCode = ERROR_CODES.HTTP_BAD_REQUEST;
      res.send(err);
    } else if (err) {
      res.statusCode = ERROR_CODES.HTTP_BAD_REQUEST;
      res.send(err);
    } else next();
  });
};
