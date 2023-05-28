import { Schema, model, Document } from "mongoose";
import { UserType } from "./User";

export interface MessageType extends Document {
    _id?: string;
    title?: string;
    message?: string;
    user?: UserType;
    createdAt?: Date;
}
const MessageSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default model<MessageType>("Message", MessageSchema);
