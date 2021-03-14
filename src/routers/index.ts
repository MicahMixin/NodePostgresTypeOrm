const express = require("express");
const userRouter = require("./user");

const appRouter = express();

appRouter.use(userRouter);

module.exports = appRouter;
