import moment from "moment";
import { Schema, model, Document } from "mongoose";

export enum Frequency {
    "Every day" = 1,
    "Every 2 days",
    "Every 3 days",
    "Every 4 days",
    "Every 5 days",
    "Every 6 days",
    "Every week" = 1,
    "Every 2 weeks",
    "Every 3 weeks",
    "Every month" = 1,
    "Every 2 months",
    "Every 3 months",
    "Every 4 months",
    "Every 5 months",
    "Every 6 months",
    "Every 7 months",
    "Every 8 months",
    "Every 9 months",
    "Every 10 months",
    "Every 11 months",
    "Every year" = 1,
    "None" = -1,
}
export interface TaskType extends Document {
    _id?: string;
    name?: string;
    done?: boolean;
    details?: string;
    push?: boolean;
    targetDate?: Date;
    isSetTime?: boolean;
}
export interface BodyTaskType {
    _id?: string;
    name?: string;
    done?: boolean;
    details?: string;
    frequency?: keyof typeof Frequency;
    push?: boolean;
    targetDate?: Date;
    endDate?: Date;
    isSetTime?: boolean;
    note?: string;
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
        note: {
            type: String,
            required: false,
            default: "",
        },
        done: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetDate: {
            type: Date,
            required: false,
            default: moment().toDate(),
        },
        isSetTime: {
            type: Boolean,
            required: false,
            default: false,
        },
        push: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true }
);

export default model<TaskType>("Task", TaskSchema);
