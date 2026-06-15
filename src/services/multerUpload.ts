import multer from "multer";
import { storage, uploadLimits, cloudinary } from "./cloudinary";
export const upload = multer({
  storage: storage,
  limits: uploadLimits,
  fileFilter: (req, file, cb) => {
    const allowFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});
