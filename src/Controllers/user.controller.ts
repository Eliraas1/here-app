import { NextFunction, Request, Response } from "express";
import { getMyProfile } from "../Services/user.service";
import User, { UserType } from "../Models/User";

export const GetMyProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req["user"];
        if (!user)
            return res.status(400).json({
                success: false,
                message: "user not found or user is not logged in",
            });
        const { _id } = user;
        const data = await getMyProfile(_id);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
