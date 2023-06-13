import {
    GetMyProfile,
    SetFcmToken,
    RefreshFcmToken,
    UpdateWidgets,
} from "../Controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/myProfile", GetMyProfile);
userRouter.post("/fcmToken", SetFcmToken);
userRouter.post("/refreshFcm", RefreshFcmToken);
userRouter.put("/widgets", UpdateWidgets);

export default userRouter;
