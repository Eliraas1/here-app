import {
    GetMyProfile,
    SetFcmToken,
    RefreshFcmToken,
    UpdateWidgets,
    GetWidgets,
    SetNewUser,
} from "../Controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/myProfile", GetMyProfile);
userRouter.post("/fcmToken", SetFcmToken);
userRouter.post("/refreshFcm", RefreshFcmToken);
userRouter.put("/widgets", UpdateWidgets);
userRouter.get("/widgets", GetWidgets);
userRouter.post("/setNewUser", SetNewUser);

export default userRouter;
