const express = require("express");
const userRouter = require("./routers/user");
require("dotenv").config();

import "reflect-metadata";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
