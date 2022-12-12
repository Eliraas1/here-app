// import { signUp } from "Controllers/auth.controller";
import { Login, Logout, signUp } from "../Controllers/auth.controller";
import { Router } from "express";
import RefreshToken from "Controllers/refreshToken.controller";
import { authenticateAccessToken } from "../Services/jwtService";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", Login);
authRouter.post("/logout", authenticateAccessToken, Logout);

export default authRouter;
