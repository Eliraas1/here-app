import moment from "moment";
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
        targetDate: {
            type: String,
            required: false,
            default: moment().format("MM/DD/YYYY"),
        },
    },
    { timestamps: true }
);

// const formattedDate = moment(task.targetDate).format("MM/DD/YYYY");
export default model<TaskType>("Task", TaskSchema);
