import { GetSearchResult } from "../Controllers/search.controller";
import { Router } from "express";

const searchRouter = Router();

searchRouter.get("/search", GetSearchResult);

export default searchRouter;
