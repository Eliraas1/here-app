// import { signUp } from "Controllers/auth.controller";
import { Login, signUp } from "../Controllers/auth.controller";
import { Router } from "express";
import RefreshToken from "Controllers/refreshToken.controller";
import { authenticateAccessToken } from "../Services/jwtService";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", Login);
// authRouter.post("/refresh", RefreshToken);

authRouter.post("/getAllTasks", authenticateAccessToken, () =>
    console.log("next function successfully")
);

export default authRouter;
