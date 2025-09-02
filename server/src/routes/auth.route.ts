import { Router } from "express";
import * as Controller from "../controllers/auth.controller";
import { db } from "../utils/db";
import bcrypt from "bcrypt";

const router: Router = Router();

router.post("/createWithEmail", Controller.createWithEmail);
// router.get("/createWithEmail", async () => {
//     const hash = await bcrypt.hash("szyszka", 10);

//     await db.user.create({
//       data: {
//         email: "szyszka@gmail.com",
//         password: hash,
//         provider: "Email",
//         profile: {
//           create: {
//             name: "szyszka",
//           },
//         },
//       },
//     });

//     const hash2 = await bcrypt.hash("oliwia", 10);

//     await await db.user.create({
//       data: {
//         email: "oliwia@gmail.com",
//         password: hash2,
//         provider: "Email",
//         profile: {
//           create: {
//             name: "oliwia",
//           },
//         },
//       },
//     });

//   const hash3 = await bcrypt.hash("livie", 10);

//   await db.user.create({
//     data: {
//       email: "livie@gmail.com",
//       password: hash3,
//       provider: "Email",
//       profile: {
//         create: {
//           name: "Livie",
//         },
//       },
//     },
//   });
// });

router.post("/loginWithEmail", Controller.loginWithEmail);
router.post("/refreshToken", Controller.refresh);
router.post("/logout", Controller.logout);

export { router as AuthRouter };
