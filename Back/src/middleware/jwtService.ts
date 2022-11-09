import { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";
// import { getUserByEmail, getUserById } from "./user.service";

interface JwtProps {
    email: string;
    _id: string;
}

export const generateAccessToken = (user: JwtProps) => {
    const accessToken = sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "10d",
    });
    return accessToken;
};

export const generateRefreshToken = (user: JwtProps) => {
    const refreshToken = sign(
        user,
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: "14d",
        }
    );
    return refreshToken;
};

// export const authenticateAccessToken = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const accessToken = req.cookies["accessToken"] || "";
//     if (!accessToken) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized user",
//         });
//     }

//     verify(
//         accessToken,
//         process.env.ACCESS_TOKEN_SECRET as string,
//         async (err: VerifyErrors, decoded: JwtPayload) => {
//             if (err) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Unauthorized user",
//                 });
//             }

//             let user = await getUserByEmail(decoded?.email);

//             if (!user) {
//                 user = await getUserById(decoded?.userId);
//             }

//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Unauthorized user",
//                 });
//             }

//             req["user"] = user;
//             next();
//         }
//     );
// };

// export const authenticateRefreshToken = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const refreshToken = req.cookies["refreshToken"] || "";
//     if (!refreshToken) {
//         return res
//             .status(401)
//             .json({ success: false, message: "Missing refresh token" });
//     }

//     verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET as string,
//         async (err: VerifyErrors, decoded: JwtPayload) => {
//             if (err) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Unauthorized user",
//                 });
//             }

//             let user = await getUserByEmail(decoded?.email);

//             if (!user) {
//                 user = await getUserById(decoded?.userId);
//             }

//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Unauthorized user",
//                 });
//             }

//             req["user"] = user;
//             next();
//         }
//     );
// };

// export const setUserIfHasAccessToken = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const accessToken = req.cookies["accessToken"] || "";
//     if (!accessToken) next();

//     verify(
//         accessToken,
//         process.env.ACCESS_TOKEN_SECRET as string,
//         async (err: VerifyErrors, decoded: JwtPayload) => {
//             if (err) next();

//             let user = await getUserByEmail(decoded?.email);

//             if (!user) {
//                 user = await getUserById(decoded?.userId);
//             }

//             if (!user) next();

//             req["user"] = user;
//             next();
//         }
//     );
// };
