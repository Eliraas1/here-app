import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./Routes";
import { errorHandling } from "./Services/error.services";

const app = express();
dotenv.config();
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
app.listen("3030", () => {
    connect();
    console.log("Connected");
});
