import RefreshToken from "../Controllers/refreshToken.controller";
import { Request, Response, NextFunction } from "express";
import { JwtPayload, sign, verify, VerifyErrors } from "jsonwebtoken";
import { UserType } from "../Models/User";
import { getUserByEmail, getUserById } from "./user.service";

interface JwtProps {
    email: string;
    userId: string;
    fbId?: string;
    gId?: string;
    phone?: string;
}

export const generateAccessToken = (user: JwtProps) => {
    const accessToken = sign(user, process.env.privateKey as string, {
        algorithm: "RS256",
        expiresIn: "1h",
    });
    return accessToken;
};

export const generateRefreshToken = (user: JwtProps) => {
    const refreshToken = sign(user, process.env.privateKey as string, {
        algorithm: "RS256",
        expiresIn: "90d",
    });
    return refreshToken;
};

export const authenticateAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies["accessToken"] || "";
    if (!accessToken) {
        return res.status(401).json({
            success: false,
            signIn: false,
            message: "Unauthorized user",
        });
    }

    verify(
        accessToken as string,
        process.env.publicKey as string,
        async (err: any, decoded: any) => {
            if (err) {
                // return res.status(403).json({
                //     success: false,
                //     message: "Unauthorized user",
                // });
                return await RefreshToken(req, res, next);
            }
            console.log("verify access token succeed");
            let user = await getUserByEmail(decoded?.email);

            if (!user) {
                user = (await getUserById(decoded?.userId)) as UserType;
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized user",
                    signIn: false,
                });
            }

            req["user"] = user;
            next();
        }
    );
};
