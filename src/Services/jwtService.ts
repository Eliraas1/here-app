import RefreshToken from "../Controllers/refreshToken.controller";
import { Request, Response, NextFunction } from "express";
import { JwtPayload, sign, verify, VerifyErrors } from "jsonwebtoken";
import { UserType } from "../Models/User";
import { getUserByEmail, getUserById } from "./user.services";

interface JwtProps {
    email: string;
    userId: string;
    fbId?: string;
    gId?: string;
    phone?: string;
}

export const generateAccessToken = (user: JwtProps) => {
    // const accessToken = sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    //     expiresIn: "10d",
    // });
    const accessToken = sign(user, process.env.privateKey as string, {
        algorithm: "RS256",
        expiresIn: "10s",
    });
    return accessToken;
};

export const generateRefreshToken = (user: JwtProps) => {
    // const refreshToken = sign(
    //     user,
    //     process.env.REFRESH_TOKEN_SECRET as string,
    //     {
    //         expiresIn: "14d",
    //     }
    // );
    const refreshToken = sign(user, process.env.privateKey as string, {
        algorithm: "RS256",
        expiresIn: "14h",
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
            message: "Unauthorized user",
        });
    }

    verify(
        accessToken as string,
        process.env.publicKey as string,
        // process.env.ACCESS_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) {
                // return res.status(403).json({
                //     success: false,
                //     message: "Unauthorized user",
                // });
                return await RefreshToken(req, res, next);
            }

            let user = await getUserByEmail(decoded?.email);

            if (!user) {
                user = (await getUserById(decoded?.userId)) as UserType;
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized user",
                });
            }

            req["user"] = user;
            next();
        }
    );
};

export const authenticateRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const refreshToken = req.cookies["refreshToken"] || "";
    if (!refreshToken) {
        return res
            .status(401)
            .json({ success: false, message: "Missing refresh token" });
    }

    verify(
        refreshToken,
        process.env.publicKey as string,
        // process.env.REFRESH_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized user",
                });
            }

            let user = await getUserByEmail(decoded?.email);

            if (!user) {
                user = (await getUserById(decoded?.userId)) as UserType;
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized user",
                });
            }

            req["user"] = user;
            next();
        }
    );
};

export const setUserIfHasAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies["accessToken"] || "";
    if (!accessToken) return next();

    verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) return next();

            let user = await getUserByEmail(decoded?.email);

            if (!user) {
                user = (await getUserById(decoded?.userId)) as UserType;
            }

            if (!user) return next();

            req["user"] = user;
            next();
        }
    );
};

export const checkTokens = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cookies = req.headers.cookies || "";
    if (!cookies)
        return res.status(400).json({
            success: false,
            message: "there is no cookies",
        });
    const { accessToken, refreshToken } = JSON.parse(cookies as string);
    verify(
        accessToken as string,
        process.env.ACCESS_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err)
                return res.status(400).json({
                    success: false,
                    message: "access token or refresh token invalid",
                });

            let user = await getUserByEmail(decoded?.email);

            if (!user) {
                user = (await getUserById(decoded?.userId)) as UserType;
            }

            if (!user)
                return res.status(400).json({
                    success: false,
                    message: "access token or refresh token invalid",
                });
        }
    );
    verify(
        refreshToken as string,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err)
                return res.status(400).json({
                    success: false,
                    message: "access token or refresh token invalid",
                });

            let user = await getUserByEmail(decoded?.email);

            if (!user) {
                user = (await getUserById(decoded?.userId)) as UserType;
            }

            if (!user)
                return res.status(400).json({
                    success: false,
                    message: "access token or refresh token invalid",
                });
        }
    );
    next();
};
