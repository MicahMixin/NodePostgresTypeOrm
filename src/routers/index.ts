import * as express from "express";
import userRouter from "./userRouter";
import sneakersRouter from "./sneakerRouter";

export const appRouter = express();

appRouter.use(userRouter);
appRouter.use(sneakersRouter);

// module.exports = appRouter;
