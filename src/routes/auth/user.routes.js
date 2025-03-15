import { Router } from "express";

import {
  loginAfterSignupRequest,
  loginRequest,
  logoutRequest,
  verifyTokenRequest,
} from "../../controllers/auth/user.js";

import { authRequired } from '../../middlewares/validateToken.js'

const router = Router();

router.get("/loginFirst/:id_user", loginAfterSignupRequest);

router.get("/verifyToken", verifyTokenRequest);

router.get("/logout", authRequired, logoutRequest);

router.post("/login", loginRequest);

export default router;
