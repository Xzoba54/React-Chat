import { Router } from "express";
import * as Controller from "../controllers/chat.controller";
import loginRequired from "../middlewares/loginRequired";

const router: Router = Router();

router.post("/", loginRequired, Controller.create);

router.get("/:chatId/messages", loginRequired, Controller.getMessagesById);
router.get("/:chatId/images", loginRequired, Controller.getChatImages);
router.get("/:id", loginRequired, Controller.getById);
router.delete("/:id", loginRequired, Controller.deleteById);

export { router as ChatRouter };
