import { getSearchResult } from "../Services/search.service";
import { NextFunction, Request, Response } from "express";
export const GetSearchResult = async (
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
        const { input } = req.query;

        console.log({ input });
        const data = await getSearchResult(_id, (input as string) || "");
        return res.status(200).json({
            data,
            success: true,
            // refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
