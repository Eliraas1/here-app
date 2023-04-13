import { Router } from "express";

import {
    AddListCategory,
    DeleteListCategory,
    EditListCategory,
    GetListCategory,
} from "../Controllers/list.controller";

const listsRouter = Router();

listsRouter.post("/list/category", AddListCategory);
listsRouter.delete("/list/category/:id", DeleteListCategory);
listsRouter.get("/list/categories", GetListCategory);
listsRouter.put("/list/category", EditListCategory);
// listsRouter.post("/list/date", GetUserTasksByDate);
// listsRouter.get("/list/:id", GetUserTaskById);

export default listsRouter;
