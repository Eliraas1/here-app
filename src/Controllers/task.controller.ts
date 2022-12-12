import { NextFunction, Request, Response } from "express";
import { addTask, getUserTasks, deleteTask } from "../Services/task.service";

export const AddTask = async (
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
        const task = req.body;
        const data = await addTask(_id, task);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
export const GetUserTasks = async (
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
        const data = await getUserTasks(_id);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
export const DeleteTask = async (
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
        const taskId = req.params.id;
        const data = await deleteTask(taskId);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
