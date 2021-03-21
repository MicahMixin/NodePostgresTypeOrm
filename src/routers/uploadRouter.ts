import * as express from "express";
import { auth } from "../middleware/auth";
import { NextFunction, Request, Response } from "express";

const router = express();

router.post(
  "/upload",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {}
);

module.exports = router;
