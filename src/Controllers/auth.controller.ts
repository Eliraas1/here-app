import { Request, Response, NextFunction } from "express";
import {
    createUser,
    getUserByEmail,
    updateUser,
} from "../Services/user.services";
import { genSalt, hash, compareSync, hashSync, compare } from "bcrypt";
import { UserType } from "../Models/User";
import { createError } from "../Services/error.services";
import { validateLoginSchema } from "../Validations/ValidateAuthSchema";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../Services/jwtService";
import moment from "moment";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("asdasdsad", req.body);
        const { name, email, password } = req.body;
        const user = await getUserByEmail(email);

        if (user) return next(createError(400, "Email is already in use"));
        const salt = await genSalt();
        const hashedPassword = await hash(password, salt);

        const userFields: any = {
            name,
            email,
            password: hashedPassword,
        };
        const { password: pass, ...restUser } = await createUser(userFields);
        return res.status(200).json({
            success: true,
            message: "Registration Success",
            data: restUser,
        });
    } catch (error: any) {
        next(error);
    }
};
export const Login = async (req: Request, res: Response) => {
    try {
        const result = validateLoginSchema(req.body);
        if (result.error)
            return res
                .status(400)
                .json({ success: false, message: result.error.message });

        const user = await getUserByEmail(result.value.email, true);

        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });

        const match = await compare(result.value.password, user.password);

        if (!match)
            return res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });

        const { password, _id, email, name, tasks } = user;
        const accessToken = generateAccessToken({
            email,
            userId: _id as string,
        });
        const refreshToken = generateRefreshToken({
            email: email,
            userId: _id as string,
        });

        delete result.value.password;

        await updateUser(result.value);

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                domain: process.env.COOKIE_DOMAIN || "localhost",
                path: "/",
                expires: moment(new Date())
                    .utc(true)
                    .add(10, "seconds")
                    .toDate(),
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                domain: process.env.COOKIE_DOMAIN || "localhost",
                path: "/",
                expires: moment(new Date()).utc(true).add(14, "days").toDate(),
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
                },
            });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// export const Login = async (req: Request, res: Response) => {
//     const { generateKeyPairSync } = require("crypto");

//     const { privateKey, publicKey } = generateKeyPairSync("rsa", {
//         modulusLength: 4096,
//         publicKeyEncoding: {
//             type: "spki",
//             format: "pem",
//         },
//         privateKeyEncoding: {
//             type: "pkcs8",
//             format: "pem",
//         },
//     });
//     res.status(200).json({ privateKey, publicKey });
// };
