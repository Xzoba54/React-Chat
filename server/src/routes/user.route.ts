import { Router } from "express";
import * as Controller from "../controllers/user.controller";
import loginRequired from "../middlewares/loginRequired";
import upload from "../utils/multer";

const router: Router = Router();

router.delete("/all", Controller.deleteAll);
router.delete("/:id", Controller.deleteById);

router.get("/:id/chats", Controller.getChats);
router.get("/all", loginRequired, Controller.getAll);
router.get("/:id", Controller.getById);
router.put("/:id/profile-image", loginRequired, upload.single("image"), Controller.updateProfileImage);

export { router as UserRouter };
