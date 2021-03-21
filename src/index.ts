import * as express from "express";
import { appRouter } from "./routers/index";
import { responseHandler } from "./middleware/responseHandler";
import { errorHandler } from "./middleware/errorHandler";
require("dotenv").config();

import "reflect-metadata";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(responseHandler);
app.use(appRouter);
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
