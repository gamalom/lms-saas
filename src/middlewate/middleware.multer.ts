import fs from "fs";
import path from "path";
import multer from "multer";

const storageDir = path.join(__dirname, "../storage");

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
  //location of the file to place in the server
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },

  filename: (req, file, cb) => {
    //name of the file to be stored in the server with the modify of name with the date and time
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export { multer, storage };
