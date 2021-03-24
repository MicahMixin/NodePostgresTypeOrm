import * as winston from "winston";
import { format } from "winston";

export const logger = winston.createLogger({
  format: format.combine(format.splat(), format.simple()),
  transports: [
    new winston.transports.File({ filename: "sneakers.log", level: "info" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});
