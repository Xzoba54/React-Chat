import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import * as Controller from "../controllers/message.controller";
import upload from "../utils/multer";

const router: Router = Router();

const multer = (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.body;

  if (type === "Text") next();

  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file" });
    }

    next();
  });
};

router.post("/", multer, Controller.create);
router.post("/:id/reaction", Controller.reaction);
router.delete("/", Controller.deleteAll);

export { router as MessageRouter };
