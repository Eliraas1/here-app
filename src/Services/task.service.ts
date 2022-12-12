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
export const getUserTasks = async (_id: string) => {
    try {
        const tasks = await Task.find({ user: _id });
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
