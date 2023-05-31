import User from "../Models/User";
import Message, { MessageType } from "../Models/Message";

export const getUserMessages = async (_id: string) => {
    try {
        const messages = await Message.find({ user: _id }).sort({
            createdAt: -1,
        });
        return messages;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const addOrEditMessage = async (_id: string, message: MessageType) => {
    try {
        if (message._id) {
            const { _id, ...rest } = message;
            return await Message.findOneAndUpdate({ _id: message._id }, rest, {
                new: true,
            });
        }
        const user = await User.findOne({ _id });
        const newMessage = new Message({
            ...message,
            user: _id,
        });
        const savedMessage = await newMessage.save();
        user?.messages?.push(savedMessage);
        await user?.save();
        return savedMessage;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const deleteMessages = async (ids: string[]) => {
    const deletedItems = await Message.deleteMany({
        _id: { $in: ids },
    });
    return deletedItems;
};
