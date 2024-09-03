import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === ".wav") {
      cb(null, "public/uploads/voices/");
    } else {
      cb(null, "public/uploads/files/");
    }
  },
  filename: (req: Request, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === ".wav") {
      cb(null, `${Date.now()}-${Math.random() % 7}-${file.originalname}`);
    } else {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  },
});

const upload = multer({ storage: storage });
export default upload;
