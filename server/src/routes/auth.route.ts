import { Router } from "express";
import * as Controller from "../controllers/auth.controller";

const router: Router = Router();

router.post("/createWithEmail", Controller.createWithEmail);
router.post("/loginWithEmail", Controller.loginWithEmail);
router.post("/refreshToken", Controller.refresh);
router.post("/logout", Controller.logout);

export { router as AuthRouter };
