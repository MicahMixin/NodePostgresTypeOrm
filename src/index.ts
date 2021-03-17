const express = require("express");
const appRouter = require("./routers/index");
const { responseHandler } = require("./middleware/responseHandler");
const { errorHandler } = require("./middleware/errorHandler");
require("dotenv").config();

import "reflect-metadata";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(appRouter);
app.use(errorHandler);
app.use(responseHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
