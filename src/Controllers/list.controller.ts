import { CheckBoxListTypeArr } from "../Models/List";
import { createError } from "../Services/error.services";
import {
    addListCategory,
    addListToCategory,
    deleteListCategory,
    editListCategory,
    editListTitle,
    getListCategory,
    deleteList,
    editListCheckBoxType,
    addItemsToList,
    deleteItemInList,
    editListFlag,
    getPrioritizedLists,
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
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const GetPrioritizedLists = async (
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
        const data = await getPrioritizedLists(_id);
        return res.status(200).json({
            data,
            refresh: req.refresh,
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
            refresh: req.refresh,
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
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const AddListToCategory = async (
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
        const { title, id } = req.body;
        if (!title) return next(createError(400, "Title not provided"));
        const data = await addListToCategory(id, title);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const EditListTitle = async (
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
        const { title, id } = req.body;
        if (!title) return next(createError(400, "Title not provided"));
        const data = await editListTitle(id, title);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const EditListFlag = async (
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
        const { flag, id } = req.body;
        if (typeof flag === "undefined")
            return next(createError(400, "Flag not provided"));
        const data = await editListFlag(id, flag);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const EditListCheckBoxType = async (
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
        const { checkboxType, id } = req.body;
        if (!checkboxType) return next(createError(400, "Title not provided"));
        if (!CheckBoxListTypeArr.includes(checkboxType))
            return next(
                createError(
                    400,
                    `checkboxType must be on of this type ${CheckBoxListTypeArr.join(
                        " "
                    )}`
                )
            );
        const data = await editListCheckBoxType(id, checkboxType);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};

export const DeleteList = async (
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
        const data = await deleteList(id);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const AddItems = async (
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
        const listId = req.body.listId;
        const items = req.body.items;
        const deleted = req.body.deleted;
        const data = await addItemsToList(listId, items, deleted);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const DeleteItem = async (
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
        const data = await deleteItemInList(id);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
