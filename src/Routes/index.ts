import { Router } from "express";
import { authenticateAccessToken } from "../Services/jwtService";
import authRouter from "./auth.router";
import taskRouter from "./task.router";
import userRouter from "./user.router";

const routes = Router();

routes.get("/", async (req, res) => {
    res.status(200).json({ data: "hello" });
});

routes.use("/", authRouter);
routes.use("/user", authenticateAccessToken, userRouter);
routes.use("/", authenticateAccessToken, taskRouter);
export default routes;
