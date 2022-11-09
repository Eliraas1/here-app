import { Schema, model, Document } from "mongoose";
export interface TaskType extends Document {
    _id: string;
    name: string;
    done: boolean;
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
    },
    { timestamps: true }
);
export default model<TaskType>("Task", TaskSchema);
