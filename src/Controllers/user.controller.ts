import { NextFunction, Request, Response } from "express";
import {
    getMyProfile,
    setFcmToken,
    replaceFcmToken,
    updateWidgets,
} from "../Services/user.service";

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
        const data = await setFcmToken(_id, token);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const RefreshFcmToken = async (
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
        const { newToken, oldToken } = req.body;
        const data = await replaceFcmToken(_id, oldToken, newToken);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const UpdateWidgets = async (
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
        const { widgets } = req.body;
        if (!Array.isArray(widgets))
            throw new Error(" widgets must be an array of strings");
        const data = await updateWidgets(_id, widgets);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
