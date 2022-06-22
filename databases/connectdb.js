import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB conectada");
} catch (error) {
    console.log(error.message);
}
