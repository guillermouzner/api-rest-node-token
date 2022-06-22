import { Router } from "express";
import { validateToken } from "../middlewares/auth/validationsTokenManager.js";
import {
    bodyLinkValidator,
    paramsLinkValidator,
} from "../middlewares/auth/validatorManager.js";
import {
    createLink,
    getLinks,
    getLink,
    removeLink,
    updateLink,
} from "../controllers/link.controller.js";

const router = Router();

// Obtener todos los links
router.get("/", validateToken, getLinks);

// Obtener un link
router.get("/:nanoLink", getLink);

// Crear link
router.post("/", validateToken, bodyLinkValidator, createLink);

// Eliminar link
router.delete("/:id", validateToken, paramsLinkValidator, removeLink);

// Editar link
router.patch(
    "/:id",
    validateToken,
    paramsLinkValidator,
    bodyLinkValidator,
    updateLink
);

export default router;
