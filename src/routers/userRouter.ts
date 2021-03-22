import * as express from "express";
import { auth } from "../middleware/auth";
import { userController } from "../controller/userController";

const userRouter = express();

userRouter.get("/users/me", auth, userController.userDetails);

userRouter.post("/users", userController.userRegister);

userRouter.post("/users/login", userController.userLogin);

userRouter.get("/users/:id(\\d+)", auth, userController.userById);

userRouter.delete("/users/:id(\\d+)", auth, userController.deleteUserById);

userRouter.patch("/users/:id(\\d+)", auth, userController.updateUserById);

userRouter.patch(
  "/users/:id(\\d+)/sneakers",
  auth,
  userController.addSneakersForUser
);

export default userRouter;
