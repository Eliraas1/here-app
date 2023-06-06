import { Request, Response, NextFunction } from "express";
import {
    createUser,
    getUserByEmail,
    replaceFcmToken,
    updateUser,
} from "../Services/user.service";
import { genSalt, hash, compareSync, hashSync, compare } from "bcrypt";
import User, { UserType } from "../Models/User";
import { createError } from "../Services/error.services";
import { validateLoginSchema } from "../Validations/ValidateAuthSchema";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../Services/jwtService";
import moment from "moment";
import admin from "firebase-admin";
import { getOrCreateUserWithGoogle } from "../Services/firebase.service";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const name = req.body.fullName;
        const user = await getUserByEmail(email);

        if (user) return next(createError(400, "Email is already in use"));
        const salt = await genSalt();
        const hashedPassword = await hash(password, salt);

        const userFields: any = {
            name,
            email,
            password: hashedPassword,
        };
        const {
            password: pass,
            name: fullName,
            email: emailAddress,
            _id,
        } = await createUser(userFields);

        return res.status(200).json({
            success: true,
            message: "Registration Success",
            data: {
                name: fullName,
                email: emailAddress,
                _id,
            },
        });
    } catch (error: any) {
        next(error);
    }
};
export const Login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = validateLoginSchema(req.body);
        if (result.error)
            return res
                .status(400)
                .json({ success: false, message: result.error.message });

        const user = await getUserByEmail(result.value.email);
        // console.log(user);
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });

        const match = await compare(result.value.password, user.password);

        if (!match)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });

        const { password, _id, email, name, tasks } = user;
        const accessToken = generateAccessToken({
            email,
            userId: _id as string,
        });
        const refreshToken = generateRefreshToken({
            email: email,
            userId: _id as string,
        });

        // delete result.value.password;

        // await updateUser(result.value);

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                domain: process.env.COOKIE_DOMAIN || "localhost",
                path: "/",
                expires: moment(new Date()).utc(true).add(1, "hour").toDate(),
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                domain: process.env.COOKIE_DOMAIN || "localhost",
                path: "/",
                expires: moment(new Date()).utc(true).add(90, "days").toDate(),
            })
            .json({
                success: true,
                message: "Login success",
                data: {
                    accessToken,
                    refreshToken,
                    user: {
                        _id,
                        email,
                        name,
                        tasks,
                    },
                    signIn: true,
                },
            });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const LoginWithGmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return false;
        }
        const idToken = authorization.split("Bearer ")[1];
        const user = await getOrCreateUserWithGoogle(idToken);
        if (!user) throw new Error("Couldn't get or create user with google");
        return res.status(200).json({
            success: true,
            message: "Login with google success",
            data: {
                signIn: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                },
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const Logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const fcmToken = req.headers["x-fcmtoken"];
        const { user } = req;
        replaceFcmToken(user._id, fcmToken as string);
        const { accessToken, refreshToken } = req.cookies;
        refreshToken &&
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: false,
            });
        accessToken &&
            res.clearCookie("accessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: false,
            });
        return res
            .status(200)
            .json({ success: true, message: "logout successfully" });
    } catch (error: any) {
        next(createError(400, error));
    }
};
