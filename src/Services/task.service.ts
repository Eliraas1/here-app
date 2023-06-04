import moment from "moment";
import Task, { TaskType } from "../Models/Task";
import User, { UserType } from "../Models/User";
import { sendNotification, sendPushNotification } from "./firebase.service";

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
        const closestTask: TaskType | null = await Task.findOne({
            $and: [
                { user: _id },
                {
                    targetDate: { $gte: realDate || moment().toDate() }, // Get tasks with targetDate greater than or equal to current date and time
                },
            ],
        })
            .sort("targetDate") // Sort the tasks by targetDate in ascending order
            .limit(1); // Retrieve only the closest task

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
        const endDay = moment(startDay)
            .set("hour", 23)
            .set("minute", 59)
            .set("second", 59);
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
    // const realDate = new Date(
    //     currentTime.getTime() - currentTime.getTimezoneOffset() * 60000
    // );
    // var d = new Date();
    // var utcDate = new Date(
    //     Date.UTC(
    //         d.getUTCFullYear(),
    //         d.getUTCMonth(),
    //         d.getUTCDate(),
    //         d.getUTCHours(),
    //         d.getUTCMinutes(),
    //         d.getUTCSeconds(),
    //         d.getUTCMilliseconds()
    //     )
    // );
    // var b = new Date(realDate);
    // var utcDate2 = new Date(
    //     Date.UTC(
    //         b.getUTCFullYear(),
    //         b.getUTCMonth(),
    //         b.getUTCDate(),
    //         b.getUTCHours(),
    //         b.getUTCMinutes(),
    //         b.getUTCSeconds(),
    //         b.getUTCMilliseconds()
    //     )
    // );
    const ltDate = new Date(realDate);
    ltDate.setMinutes(realDate.getMinutes() + 60);
    console.log({
        ltDate,
        realDate,
    });
    try {
        const tasks = await Task.find({
            $and: [
                // { push: true },
                { notified: false },
                {
                    targetDate: { $gte: realDate }, // Get tasks with targetDate greater than or equal to current date and time
                },
                {
                    targetDate: { $lte: ltDate }, // Get tasks with targetDate less than or equal to current date and time
                },
            ],
        }).populate("user");
        tasks.forEach((task) => sendNotification(task.user, task));
        return tasks;
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
};
