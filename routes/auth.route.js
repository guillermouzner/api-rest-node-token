import { Router } from "express";
import {
    login,
    refreshToken,
    register,
    infoUser,
    logout,
} from "../controllers/auth.controller.js";

import {
    requireRefreshToken,
    validateToken,
} from "../middlewares/auth/validationsTokenManager.js";

import {
    bodyRegisterValidator,
    bodyLoginValidator,
} from "../middlewares/auth/validatorManager.js";

const router = Router();

router.post("/register", bodyRegisterValidator, register);

// login de usuario

router.post("/login", bodyLoginValidator, login);

// refresh token
router.get("/refresh", requireRefreshToken, refreshToken);

// ruta protegida
router.get("/protected", validateToken, infoUser);

// logout de usuario
router.get("/logout", logout);

export default router;
