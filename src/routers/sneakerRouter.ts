import * as express from "express";
import { auth } from "../middleware/auth";
import { sneakerController } from "../controller/sneakerController";

const sneakerRouter = express();

sneakerRouter.post("/sneakers", auth, sneakerController.addNewSneaker);

sneakerRouter.get(
  "/sneakers/:id(\\d+)",
  auth,
  sneakerController.getSneakerById
);

sneakerRouter.get("/sneakers", auth, sneakerController.getSneaker);

sneakerRouter.delete(
  "/sneakers/:id(\\d+)",
  auth,
  sneakerController.deleteSneakerById
);

sneakerRouter.patch(
  "/sneakers/:id(\\d+)",
  auth,
  sneakerController.updateSneakerById
);

export default sneakerRouter;
