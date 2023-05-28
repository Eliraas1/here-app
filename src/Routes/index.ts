import { Router } from "express";
import { authenticateAccessToken } from "../Services/jwtService";
import authRouter from "./auth.router";
import taskRouter from "./task.router";
import userRouter from "./user.router";
import listsRouter from "./list.router";
import messageRouter from "./message.router";

const routes = Router();
//
routes.get("/", async (req, res) => {
    res.status(200).json({ data: "hello" });
});

routes.use("/", authRouter);
routes.use("/user", authenticateAccessToken, userRouter);
routes.use("/", authenticateAccessToken, taskRouter);
routes.use("/", authenticateAccessToken, listsRouter);
routes.use("/", authenticateAccessToken, messageRouter);
export default routes;
