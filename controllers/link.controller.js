import { Link } from "../models/Links.js";
import { nanoid } from "nanoid";

export const getLinks = async (req, res) => {
    try {
        const links = await Link.find({ uid: req.uid });
        return res.json({ links });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "error de servidor" });
    }
};
export const getLink = async (req, res) => {
    try {
        const { nanoLink } = req.params;
        const link = await Link.findOne({ nanoLink });
        if (!link) return res.status(404).json({ error: "no existe el link" });

        // Si queremos obtener link como ruta protegida //
        /*
        if (!link.uid.equals(req.uid))
            return res
                .status(401)
                .json({ error: "no puede acceder a ese link" });
        */
        return res.status(201).json({ link: link.longLink });

        //return res.redirect(link.longLink);
    } catch (error) {
        console.log(error.message);
        if (error.kind === "ObjectId")
            return res.status(403).json({ error: "formato id incorrecto" });
        return res.status(500).json({ error: "error de servidor" });
    }
};
export const createLink = async (req, res) => {
    try {
        let { longLink } = req.body;
        if (!longLink.startsWith("https://")) {
            longLink = "https://" + longLink;
        }

        const link = new Link({
            longLink,
            nanoLink: nanoid(5),
            uid: req.uid,
        });

        const newLink = await link.save();

        return res.status(201).json({
            newLink: {
                link: link.longLink,
                nanoLink: link.nanoLink,
                id: link._id,
            },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "error de servidor" });
    }
};
export const removeLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await Link.findById(id);

        if (!link) return res.status(404).json({ error: "no existe el link" });

        if (!link.uid.equals(req.uid))
            return res.status(401).json({ error: "no tienes acceso al link" });

        await link.remove();

        return res.json({ linkRemove: link.longLink });
    } catch (error) {
        console.log(error.message);
        if (error.kind === "ObjectId")
            return res.status(403).json({ error: "formato id incorrecto" });
        return res.status(500).json({ error: "error de servidor" });
    }
};
export const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { longLink } = req.body;

        if (!longLink.startsWith("https://")) {
            longLink = "https://" + longLink;
        }
        const link = await Link.findById(id);
        if (!link) return res.status(404).json({ error: "no existe el link" });
        if (!link.uid.equals(req.uid))
            return res.json({ error: "no tienes acceso al link " });

        //Update
        link.longLink = longLink;
        await link.save();
        return res.json({
            link: {
                id: link._id,
                longLink: link.longLink,
                nanoLink: link.nanoLink,
            },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "error de servidor" });
    }
};
