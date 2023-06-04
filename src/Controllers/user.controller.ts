import { NextFunction, Request, Response } from "express";
import { getMyProfile, setFcmToken } from "../Services/user.service";

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
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const SetFcmToken = async (
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
        const { token } = req.body;
        console.log(req.body);
        const data = await setFcmToken(_id, token);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
