import moment from "moment";
import Task, { TaskType } from "../Models/Task";
import User, { UserType } from "../Models/User";
import { sendNotification } from "./firebase.service";

export const addTask = async (_id: string, task: TaskType) => {
    try {
        const user = await User.findOne({ _id });
        const newDate = new Date(task?.targetDate || new Date());
        const realDate = new Date(
            newDate.getTime() + newDate.getTimezoneOffset() * 1
        );
        task.targetDate = realDate;
        const newTask = new Task({
            notified: false,
            ...task,
            user: _id,
        });
        const savedTask = await newTask.save();

        user?.tasks?.push(savedTask);
        await user?.save();
        return savedTask;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const editTask = async (
    _id: string,
    taskId: string,
    values: TaskType
) => {
    try {
        const user = await User.findOne({ _id });
        if (!user) throw new Error("User is required");
        const task = await Task.findOneAndUpdate(
            {
                user: user._id,
                _id: taskId,
            },
            values
        );

        return task;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const getUserTaskById = async (_id: string, taskId: string) => {
    try {
        const user = await User.findOne({ _id });
        if (!user) throw new Error("User is required");
        const task = await Task.findOne({
            user: user._id,
            _id: taskId,
        });

        return task;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};

export const getUserTasks = async (_id: string) => {
    try {
        const tasks = await Task.find({ user: _id });
        return tasks;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const getUserNextTask = async (_id: string, date?: Date) => {
    try {
        const _date = new Date(date || new Date());
        const realDate = new Date(
            _date.getTime() + _date.getTimezoneOffset() * 60000
        );
        const closestTask: TaskType[] | null = await Task.find({
            $and: [
                { user: _id },
                { done: false },
                {
                    targetDate: { $gte: realDate || moment().toDate() }, // Get tasks with targetDate greater than or equal to current date and time
                },
            ],
        })
            .sort({ targetDate: "ascending" }) // Sort the tasks by targetDate in ascending order
            .limit(2); // Retrieve only the closest task

        return closestTask;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const getUserTasksByDate = async (_id: string, date: string) => {
    try {
        const newDate = new Date(date);
        const realDate = new Date(
            newDate.getTime() + newDate.getTimezoneOffset() * 60000
        );
        const [day, month, year] = realDate
            .toLocaleDateString("default", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            })
            .split(".");

        //without this conversion, utc date can be 02-03 instead of 03-03, and we can get task with incorrect target date
        const fixedStringToConvert = `${year}-${month}-${day}`;
        const startDay = new Date(fixedStringToConvert);
        const endDay = new Date(startDay);
        endDay.setUTCHours(23, 59, 59, 59);
        const tasks = await Task.find({
            user: _id,
            $and: [
                { targetDate: { $gte: startDay } },
                { targetDate: { $lte: endDay } },
            ],
        }).sort({ targetDate: "asc" });
        return tasks;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const deleteTask = async (userId: string, _id: string) => {
    try {
        const task = await Task.findOneAndDelete({ _id });
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { tasks: _id },
            },
            {
                new: true,
            }
        );
        return task;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const deleteManyTasks = async (userId: string, ids: string[]) => {
    const deletedTasks = await Task.deleteMany({
        _id: { $in: ids },
    });
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $pullAll: { tasks: ids },
        },
        {
            new: true,
        }
    );
    return deletedTasks;
};

export const getNotifiedTask = async () => {
    const realDate = new Date(
        new Date().toLocaleString("en", { timeZone: "israel" })
    );
    const ltDate = new Date(realDate);
    const HOUR = 60;
    ltDate.setMinutes(realDate.getMinutes() + 8 * HOUR);
    console.log({
        ltDate,
        realDate,
    });
    try {
        const tasks = await Task.find({
            $and: [
                { done: false },
                { push: true },
                { notified: false },
                {
                    targetDate: { $gte: realDate }, // Get tasks with targetDate greater than or equal to current date and time
                },
                {
                    targetDate: { $lte: ltDate }, // Get tasks with targetDate less than or equal to current date and time
                },
                // { user: "647eeb51561151606c2d9111" }, // eliran user
            ],
        }).populate({
            path: "user",
            select: "-password", // Exclude the "password" field
        });
        tasks.forEach((task) => sendNotification(task.user, task));
        return tasks;
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
};

export const insertManyTasksToUser = async (
    userId: string,
    tasks: TaskType[]
) => {
    const newTasks = await Task.insertMany(tasks);
    await User.findByIdAndUpdate(
        userId,
        { $addToSet: { tasks: newTasks } },
        { new: true }
    );
    return newTasks;
};
