import { createError } from "../Services/error.services";
import {
    addListCategory,
    deleteListCategory,
    editListCategory,
    getListCategory,
} from "../Services/list.service";
import { NextFunction, Request, Response } from "express";

export const AddListCategory = async (
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
        const { name } = req.body;
        const data = await addListCategory(_id, name);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
export const GetListCategory = async (
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
        const data = await getListCategory(_id);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
export const DeleteListCategory = async (
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
        const { id } = req.params;
        const { _id } = user;
        const data = await deleteListCategory(_id, id);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
export const EditListCategory = async (
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
        const { name, id } = req.body;
        if (!name) return next(createError(500, "Must Choose a name!"));
        const data = await editListCategory(id, name);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
