import { Router } from "express";
import * as Controller from "../controllers/chat.controller";

const router: Router = Router();

router.post("/create", Controller.create);

router.get("/:chatId/messages", Controller.getMessagesById);
router.get("/:id", Controller.getById);
router.delete("/:id", Controller.deleteById);

export { router as ChatRouter };
