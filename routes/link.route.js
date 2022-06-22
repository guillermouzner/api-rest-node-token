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

router.get("/", validateToken, getLinks);

router.get("/:nanoLink", getLink);

router.post("/", validateToken, bodyLinkValidator, createLink);

router.delete("/:id", validateToken, paramsLinkValidator, removeLink);

router.patch(
    "/:id",
    validateToken,
    paramsLinkValidator,
    bodyLinkValidator,
    updateLink
);

export default router;
