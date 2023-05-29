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
            return { ...res._doc, description: res.details };
        });
        const newMsg = messages.map((res: any) => {
            return {
                ...res._doc,
                title: res.createdAt,
                description: res.message,
            };
        });
        const newLists = lists.map((res: any) => {
            return {
                ...res._doc,
                title: res.categoryName,
                description: res.title,
            };
        });
        return { tasks: newTasks, messages: newMsg, lists: newLists };
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
// export async function getSearchResult(_id: string, input: string) {
//     try {
//         const types: string[] = [];
//         if (field.type) {
//             types[0] = field.type;
//             const charToReplace = (field.type as string).includes("-")
//                 ? "-"
//                 : " ";
//             const replaceTo = (field.type as string).includes("-") ? " " : "-";
//             types[1] = (field.type as string).replace(charToReplace, replaceTo);
//         }

//         const query = {
//             ...(field.location && {
//                 location: { $regex: field.location, $options: "i" },
//             }),
//             ...(field.title && {
//                 title: { $regex: field.title, $options: "i" },
//             }),
//             ...(field.type && {
//                 type: { $in: types },
//             }),
//             ...(field.category && {
//                 category: field.category,
//             }),
//             ...(field.description && {
//                 description: { $regex: field.description, $options: "i" },
//             }),
//         };

//         console.log("in server, query", field, query);
//         const jobs: JobsType[] = await Jobs.find(query)
//             .sort({ createdAt: -1 })
//             .populate([
//                 {
//                     path: "user",
//                     select: "-password",
//                 },
//             ]);
//         return jobs;
//     } catch (error: any) {
//         throw new Error(error.message as string);
//     }
// }
