import { Router } from "express";
import authRouter from "./auth.router";

const routes = Router();

routes.get("/", async (req, res) => {
    res.status(200).json({ data: "helloasdasdasdasd" });
});

routes.use("/auth", authRouter);

export default routes;
