import { Router } from "express";
import * as Controller from "../controllers/chat.controller";
import loginRequired from "../middlewares/loginRequired";

const router: Router = Router();

router.post("/", loginRequired, Controller.create);

router.get("/:chatId/messages", Controller.getMessagesById);
router.get("/:chatId/images", Controller.getChatImages);
router.get("/:id", Controller.getById);
router.delete("/:id", Controller.deleteById);

export { router as ChatRouter };
