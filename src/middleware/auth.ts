const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
import { userRepository } from "../repository/user";

const auth = async (req: Request, res: Response, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findOne({ id: decoded.id });
    if (!user) {
      throw new Error();
    }
    req["user"] = user;
    next();
  } catch (error) {
    res.status(401).json({ Error: "Invalid token" });
  }
};

module.exports = { auth };
