import {
    Login,
    LoginWithGmail,
    Logout,
    signUp,
    DeleteUser,
} from "../Controllers/auth.controller";
import { Router } from "express";
import { authenticateAccessToken } from "../Services/jwtService";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", Login);
authRouter.post("/google-login", LoginWithGmail);
authRouter.post("/logout", authenticateAccessToken, Logout);
authRouter.post("/deleteUser", DeleteUser);

export default authRouter;
