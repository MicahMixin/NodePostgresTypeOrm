import * as express from "express";
import { uploadController } from "../controller/uploadController";
import { auth } from "../middleware/auth";
import { upload } from "../utils/upload";

const uploadRouter = express();

uploadRouter.post("/upload", auth, upload, uploadController.uploadMedia);

export default uploadRouter;
