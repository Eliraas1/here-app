import mongoose from "mongoose";
import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import routes from "./Routes";
import { errorHandling } from "./Services/error.services";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToFirebase } from "./config/firebase";
const PORT = process.env.PORT || "3000";
const connect = () => {
    mongoose.set("strictQuery", false);
    mongoose
        .connect(process.env.MONGO_PATH as string, { dbName: "HereApp" })
        .then(() => {
            console.log("connected to mongodb");
        })
        .catch((err) => {
            throw err;
        });
};
const app = express();
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000", "*"],
        exposedHeaders: ["Set-Cookie"],
    })
);

app.use(cookieParser());
app.use(json({ limit: "21mb" }));
app.use(urlencoded({ extended: true, limit: "21mb" }));
app.use(routes);
app.use(errorHandling);
app.listen(PORT, () => {
    connect();
    connectToFirebase();
    console.log(`Connected on port ${PORT}`);
});
