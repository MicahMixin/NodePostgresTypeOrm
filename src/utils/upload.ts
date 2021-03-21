import * as multer from "multer";

export const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be an image"));
    }
    cb(undefined, true);
  },
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
});
