// import { signUp } from "Controllers/auth.controller";
import { GetMyProfile } from "../Controllers/user.controller";
import { Router } from "express";
// import { authenticateAccessToken } from "../Services/jwtService";

const userRouter = Router();

userRouter.get("/myProfile", GetMyProfile);

export default userRouter;
