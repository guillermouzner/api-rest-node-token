import jwt from "jsonwebtoken";

import { tokenErrors } from "../../utils/errorsManager.js";

export const requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error("No existe el token");
        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        req.uid = uid;
        next();
    } catch (error) {
        console.log(error.message);

        return res.status(401).json({ errors: tokenErrors[error.message] });
    }
};

export const validateToken = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) throw new Error("Formato Bearer");
        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
    } catch (error) {
        return res.status(401).json({ errors: tokenErrors[error.message] });
    }
};
