import { User } from "../models/User.js";
import {
    generateRefreshToken,
    generateToken,
} from "../middlewares/auth/generateTokenManager.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });

        await user.save();

        // jwt token
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ redirec: "/login", token, expiresIn });
    } catch (error) {
        return res.status(500).json({ error: "error de servidor" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "No existe el usuario" });

        const userPassword = await user.comparePassword(password);
        if (!userPassword)
            return res.status(403).json({ error: "Constraseña incorrecta" });

        // jwt token
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ redirec: "/", token, expiresIn });
    } catch (error) {
        console.log(error);
    }
};

export const refreshToken = (req, res) => {
    try {
        const { token, expiresIn } = generateToken(req.uid);
        return res.json({ refreshtoken: "existe token", token, expiresIn });
    } catch (error) {
        return res.status(500).json({ error: "error de servidor" });
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        return res.json({ email: user.email, id: user._id });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "error de servidor" });
    }
};

export const logout = (_req, res) => {
    res.clearCookie("refreshToken");
    res.json({ token: "token eliminado" });
};
