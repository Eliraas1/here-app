import { Schema, model, Document } from "mongoose";
export interface TaskType extends Document {
    _id?: string;
    name?: string;
    done?: boolean;
    expires?: Date;
    details?: string;
}
const TaskSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            required: true,
        },
        done: {
            type: Boolean,
            default: false,
        },
        expires: {
            type: Date,
            default: null,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
export default model<TaskType>("Task", TaskSchema);
