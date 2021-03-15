const express = require("express");
const userRouter = require("./user");
const sneakersRouter = require("./sneaker");

const appRouter = express();

appRouter.use(userRouter);
appRouter.use(sneakersRouter);

module.exports = appRouter;
