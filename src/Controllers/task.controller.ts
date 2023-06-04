import { NextFunction, Request, Response } from "express";
import {
    addTask,
    getUserTasks,
    deleteTask,
    getUserTasksByDate,
    editTask,
    getUserTaskById,
    getUserNextTask,
    getNotifiedTask,
    deleteManyTasks,
} from "../Services/task.service";
import { BodyTaskType, Frequency, TaskType } from "../Models/Task";
import moment from "moment";
import User from "../Models/User";

type Units = moment.unitOfTime.DurationConstructor | undefined;

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
        const data = await addTaskByFrequency(task, _id);
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};

const addTaskByFrequency = async (task: BodyTaskType, id: string) => {
    const tasks: TaskType[] = [];
    if (task._id) return editTask(id, task._id, task as TaskType);
    if (!task.frequency || task.frequency === "None") {
        const newTask = await addTask(id, task as TaskType);
        tasks.push(newTask);
        return tasks;
    }
    const freq = task.frequency;
    //
    const unit = freq.split(" ").at(-1) as Units;
    const amount = Frequency[freq];
    const targetDate = task.targetDate;
    const endDate = task.endDate;
    if (amount < 1) return;

    const date1 = task.isSetTime
        ? moment(targetDate)
        : moment(targetDate).set("hour", 23).set("minute", 59);
    const date2 = endDate ? moment(endDate) : moment(date1).add(1, "year");

    while (date1 <= date2) {
        const currentDate = date1.toDate(); // start date
        const updatedTask = { ...task, targetDate: currentDate } as TaskType;
        const newTask = await addTask(id, updatedTask);
        tasks.push(newTask);
        date1.add(amount, unit);
    }

    return tasks;
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
        if (!date)
            return res.status(400).json({
                success: false,
                message: "date is required",
            });
        const data = await getUserTasksByDate(_id, date);
        return res.status(200).json({
            data,
            refresh: req.refresh,
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
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const GetUserNextTask = async (
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
        const data = await getUserNextTask(_id, date);
        return res.status(200).json({
            data,
            refresh: req.refresh,
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
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
export const DeleteManyTasks = async (
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
        const taskIds = req.body.ids;
        const data = await deleteManyTasks(user._id, taskIds);
        return res.status(200).json({
            data,
            refresh: req.refresh,
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
        const data = await deleteTask(user._id, taskId);
        return res.status(200).json({
            data,
            refresh: req.refresh,
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
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};

export const GetNotifiedTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await getNotifiedTask();
        return res.status(200).json({
            data,
            refresh: req.refresh,
        });
    } catch (error: any) {
        next(error);
    }
};
