import * as express from "express";
import userRouter from "./userRouter";
import sneakersRouter from "./sneakerRouter";
import uploadRouter from "./uploadRouter";

export const appRouter = express();

appRouter.use(userRouter);
appRouter.use(sneakersRouter);
appRouter.use(uploadRouter);
