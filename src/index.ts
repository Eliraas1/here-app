import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./Routes";
import { errorHandling } from "./Services/error.services";
dotenv.config();
const app = express();
const PORT = process.env.PORT || "3000";
const connect = () => {
    mongoose
        .connect(process.env.MONGO_PATH as string, { dbName: "HereApp" })
        .then(() => {
            console.log("connected to mongodb");
        })
        .catch((err) => {
            throw err;
        });
};
app.use(json({ limit: "21mb" }));
app.use(routes);
app.use(errorHandling);
app.listen(PORT, () => {
    connect();
    console.log("Connected");
});
