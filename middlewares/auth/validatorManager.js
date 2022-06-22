import { body, validationResult, param } from "express-validator";
import axios from "axios";

export const validationExpress = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
export const bodyRegisterValidator = [
    body("email", "formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "La contraseña debe tener al menos 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
    body("password", "Validacion con repassword").custom((value, { req }) => {
        if (value !== req.body.repassword) {
            throw new Error("Las contraseñas no coindicen");
        }
        return value;
    }),
    validationExpress,
];
export const bodyLoginValidator = [
    body("email", "formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "La contraseña debe tener al menos 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
    validationExpress,
];
export const bodyLinkValidator = [
    body("longLink", "formato link incorrecto")
        .trim()
        .notEmpty()
        .custom(async (value) => {
            try {
                if (!value.startsWith("https://")) {
                    value = "https://" + value;
                }

                await axios.get(value);

                return value;
            } catch (error) {
                console.log(error.message);
                throw new Error(`404 not found`);
            }
        }),
    validationExpress,
];
export const paramsLinkValidator = [
    param("id", "formato no valido").trim().notEmpty().escape(),
    validationExpress,
];
