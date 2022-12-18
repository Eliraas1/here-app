import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserType } from "Models/User";
import moment from "moment";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../Services/jwtService";
import { getUserByEmail, getUserById } from "../Services/user.service";

const RefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.sendStatus(401);
        verify(
            refreshToken as string,
            (process.env.publicKey as string).replace(/\\n/gm, "\n"),
            async (err: any, decoded: any) => {
                if (err) {
                    //expired refresh token
                    //TODO: remove cookies!
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized user",
                        signIn: false,
                    });
                }
                const accessToken = generateAccessToken({
                    email: decoded?.email,
                    userId: decoded?.userId,
                });
                const newRefreshToken = generateRefreshToken({
                    email: decoded?.email,
                    userId: decoded?.userId,
                });

                let user = await getUserByEmail(decoded?.email);

                if (!user) {
                    user = (await getUserById(decoded?.userId)) as UserType;
                }

                if (!user) {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized user",
                        signIn: false,
                    });
                }

                req["user"] = user;
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    domain: process.env.COOKIE_DOMAIN || "localhost",
                    path: "/",
                    sameSite: "none",
                    expires: moment(new Date())
                        .utc(true)
                        .add(1, "hour")
                        .toDate(),
                }).cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    domain: process.env.COOKIE_DOMAIN || "localhost",
                    path: "/",
                    sameSite: "none",
                    expires: moment(new Date())
                        .utc(true)
                        .add(90, "days")
                        .toDate(),
                });
                console.log("done with refresh token");
                return next();
            }
        );
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            signIn: false,
        });
    }
};

export default RefreshToken;
