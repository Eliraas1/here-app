import { Router } from "express";

import {
    AddListCategory,
    AddListToCategory,
    DeleteListCategory,
    EditListCategory,
    EditListTitle,
    GetListCategory,
    DeleteList,
    EditListCheckBoxType,
    AddItems,
    DeleteItem,
    EditListFlag,
    GetPrioritizedLists,
    DeleteListCategories,
    DeleteListsInCategories,
} from "../Controllers/list.controller";

const listsRouter = Router();

listsRouter.post("/list/category", AddListCategory);
listsRouter.delete("/list/category/:id", DeleteListCategory);
listsRouter.delete("/list/categories", DeleteListCategories);
listsRouter.delete("/list", DeleteListsInCategories);
listsRouter.get("/list/categories", GetListCategory);
listsRouter.get("/list/prioritize", GetPrioritizedLists);
listsRouter.put("/list/category", EditListCategory);
listsRouter.post("/list/title", AddListToCategory);
listsRouter.put("/list/title", EditListTitle);
listsRouter.put("/list/flag", EditListFlag);
listsRouter.put("/list/checkbox", EditListCheckBoxType);
listsRouter.delete("/list/title/:id", DeleteList);
listsRouter.post("/list/items", AddItems);
listsRouter.delete("/list/item/:id", DeleteItem);

export default listsRouter;
