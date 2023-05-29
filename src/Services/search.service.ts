import Message from "../Models/Message";
import List from "../Models/List";
import Task, { TaskType } from "../Models/Task";

export const getSearchResult = async (userId: string, input: string) => {
    try {
        //find tasks
        const taskQuery = {
            $or: [
                { name: { $regex: input, $options: "i" } },
                { details: { $regex: input, $options: "i" } },
                { note: { $regex: input, $options: "i" } },
            ],
            user: userId,
        };
        //find list
        const listQuery = {
            title: { $regex: input, $options: "i" },
            user: userId,
        };

        //find messages
        const messageQuery = {
            $or: [
                { title: { $regex: input, $options: "i" } },
                { message: { $regex: input, $options: "i" } },
            ],
            user: userId,
        };

        const result = await Promise.all([
            Task.find(taskQuery),
            Message.find(messageQuery),
            List.find(listQuery),
        ]);
        const [task, messages, lists] = result;
        const newTasks = task.map((res: any) => {
            return { ...res._doc, data: { description: res.details } };
        });
        const newMsg = messages.map((res: any) => {
            return {
                ...res._doc,
                data: {
                    title: res.createdAt,
                    description: res.message,
                },
            };
        });
        const newLists = lists.map((res: any) => {
            return {
                ...res._doc,
                data: {
                    title: res.categoryName,
                    description: res.title,
                },
            };
        });
        return { tasks: newTasks, messages: newMsg, lists: newLists };
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
