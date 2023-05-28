import { Router } from "express";
import {
    AddOrEditMessage,
    DeleteMessages,
    GetUserMessages,
} from "../Controllers/message.controller";

const messageRouter = Router();

messageRouter.get("/messages", GetUserMessages);
messageRouter.post("/message", AddOrEditMessage);
messageRouter.delete("/messages", DeleteMessages);

export default messageRouter;
