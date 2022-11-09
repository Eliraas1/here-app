// import { signUp } from "Controllers/auth.controller";
import { signUp } from "../Controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", signUp);

export default authRouter;
