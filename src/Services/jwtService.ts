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
    exp?: number;
    iat?: number;
}

export const generateAccessToken = (user: JwtProps) => {
    const accessToken = sign(
        user,
        (process.env.privateKey as string).replace(/\\n/gm, "\n"),
        {
            algorithm: "RS256",
            expiresIn: "1h",
        }
    );
    return accessToken;
};

export const generateRefreshToken = (user: JwtProps) => {
    const refreshToken = sign(
        user,
        (process.env.privateKey as string).replace(/\\n/gm, "\n"),
        {
            algorithm: "RS256",
            expiresIn: "90d",
        }
    );
    return refreshToken;
};

export const authenticateAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies["accessToken"] || "";
    // console.log(accessToken && accessToken.slice(10));
    if (!accessToken) {
        return res.status(401).json({
            success: false,
            signIn: false,
            message: "No access token cookie!",
        });
    }

    try {
        const decoded = verify(
            accessToken as string,
            (process.env.publicKey as string).replace(/\\n/gm, "\n"),
            { algorithms: ["RS256"] }
        ) as JwtProps;
        console.log("verify access token succeed");
        console.log({
            accessExpire: new Date((decoded?.exp || 1) * 1000).toLocaleString(),
        });
        let user = await getUserByEmail(decoded?.email);

        if (!user) {
            user = (await getUserById(decoded?.userId)) as UserType;
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found in decoded value from accessToken",
                signIn: false,
            });
        }

        req["user"] = user;
        next();
    } catch (e) {
        // }
        // console.log(e);
        return await RefreshToken(req, res, next);
    }
};
