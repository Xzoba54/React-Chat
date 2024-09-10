import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import * as Controller from "../controllers/message.controller";
import upload from "../utils/multer";
import loginRequired from "../middlewares/loginRequired";

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

router.post("/", loginRequired, multer, Controller.create);
router.post("/:messageId/reaction", loginRequired, Controller.reaction);
router.delete("/", Controller.deleteAll);
router.delete("/:id", loginRequired, Controller.deleteById);

export { router as MessageRouter };
