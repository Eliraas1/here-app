import {
    GetMyProfile,
    SetFcmToken,
    RefreshFcmToken,
} from "../Controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/myProfile", GetMyProfile);
userRouter.post("/fcmToken", SetFcmToken);
userRouter.post("/refreshFcm", RefreshFcmToken);

export default userRouter;
