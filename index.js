import "dotenv/config";
import cookieParser from "cookie-parser";
import "./databases/connectdb.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js";
import express from "express";
//////
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocs = require("./swagger.json");

// swagger
import swaggerUI from "swagger-ui-express";
// import swaggerJsDoc from "swagger-jsdoc";

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

// const pathname = path.join(__dirname, "./routes/*.js");

// const swaggerSpec = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Node MongoDB API-Rest",
//             version: "1.0.0",
//         },
//         servers: [
//             {
//                 url: "http://localhost:4000",
//             },
//         ],
//     },
//     apis: [pathname],
// };

const app = express();

const whiteList = [process.env.ORIGIN1];

app.use(
    cors({
        origin: function (origin, callback) {
            if (whiteList.includes(origin)) {
                return callback(null, origin);
            }
            return callback(`Error de CORS: ${origin} No autorizado`);
        },
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter);

// solo para ejemplo
app.use(express.static("public"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`estoy en http://localhost:${PORT}`);
});
