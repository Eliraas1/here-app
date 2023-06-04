// import { signUp } from "Controllers/auth.controller";
import { GetMyProfile, SetFcmToken } from "../Controllers/user.controller";
import { Router } from "express";
// import { authenticateAccessToken } from "../Services/jwtService";

const userRouter = Router();

userRouter.get("/myProfile", GetMyProfile);
userRouter.post("/fcmToken", SetFcmToken);

export default userRouter;
