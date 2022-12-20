import { NextFunction, Request, Response } from "express";
import {
    addTask,
    getUserTasks,
    deleteTask,
    getUserTasksByDate,
    editTask,
    getUserTaskById,
} from "../Services/task.service";

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
export const GetUserTasksByDate = async (
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
        const { date } = req.body;
        console.log(date);
        if (!date)
            return res.status(400).json({
                success: false,
                message: "date is required",
            });
        const data = await getUserTasksByDate(_id, date);
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
export const GetUserTaskById = async (
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
        const { id: taskId } = req.params;
        const data = await getUserTaskById(_id, taskId);
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
export const EditTask = async (
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
        const values = req.body;
        const data = await editTask(user._id, taskId, values);
        // const data = await deleteTask(taskId);
        return res.status(200).json({
            data,
        });
    } catch (error: any) {
        next(error);
    }
};
