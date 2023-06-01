import { Router } from "express";
import { authenticateAccessToken } from "../Services/jwtService";
import authRouter from "./auth.router";
import taskRouter from "./task.router";
import userRouter from "./user.router";
import listsRouter from "./list.router";
import messageRouter from "./message.router";
import searchRouter from "./search.router";
import { GetNotifiedTasks } from "../Controllers/task.controller";

const routes = Router();
//
routes.get("/", async (req, res) => {
    res.status(200).json({ data: "hello" });
});

routes.get("/notified", GetNotifiedTasks);
routes.use("/", authRouter);
routes.use("/user", authenticateAccessToken, userRouter);
routes.use("/", authenticateAccessToken, taskRouter);
routes.use("/", authenticateAccessToken, listsRouter);
routes.use("/", authenticateAccessToken, messageRouter);
routes.use("/", authenticateAccessToken, searchRouter);
export default routes;
