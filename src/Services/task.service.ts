import Task, { TaskType } from "../Models/Task";
import User from "../Models/User";

export const addTask = async (_id: string, task: TaskType) => {
    try {
        const user = await User.findOne({ _id });
        const newTask = new Task({
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
export const getUserTasksByDate = async (_id: string, date: string) => {
    try {
        const tasks = await Task.find({
            user: _id,
            targetDate: date,
        });
        return tasks;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const deleteTask = async (_id: string) => {
    try {
        const task = await Task.findOneAndDelete({ _id });
        return task;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
