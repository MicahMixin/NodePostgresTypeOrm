const jwt = require("jsonwebtoken");
const { User } = require("../entity/User");
import { Request, Response } from "express";
import { dbConnection } from "../postgres/db";

const auth = async (req: Request, res: Response, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let userRepository = await dbConnection.getConnection().getRepository(User);
    let user = new User();
    user = await userRepository.findOne({ id: decoded.id });
    if (!user) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).json({ Error: "Invalid token" });
  }
};

const getUser = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let userRepository = await dbConnection.getConnection().getRepository(User);
    let user = new User();
    user = await userRepository.findOne({ id: decoded.id });
    if (!user) {
      throw new Error();
    }
    res.send(user);
  } catch (error) {
    res.status(401).json({ Error: "Invalid token" });
  }
};

module.exports = { auth, getUser };
