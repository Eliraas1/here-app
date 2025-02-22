import { Schema, model, Document } from "mongoose";
import { TaskType } from "./Task";
import { ListCategoryType } from "./ListCategory";
import { MessageType } from "./Message";

export type Widgets =
    | "PlayGround | pizza"
    | "PlayGround | toggle"
    | "Im not stupid"
    | "Next task"
    | "Last message";
export interface UserType extends Document {
    _id?: string;
    name: string;
    email: string;
    password: string;
    img?: string;
    tasks?: TaskType[];
    messages?: MessageType[];
    listCategories: ListCategoryType[];
    fcmToken: string[];
    widgets?: Widgets[];
    isNewUser?: boolean;
}
export type OnBoardingList =
    | "Time management"
    | "Confusion"
    | "Unorganized"
    | "Lack of focus"
    | "Self-expression"
    | "Priorities"
    | "Feeling lonely"
    | "Distractions"
    | "Feeling abnormal"
    | "Frustration";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        img: {
            type: String,
        },
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
                required: false,
                default: [],
            },
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                required: false,
                default: [],
            },
        ],
        listCategories: [
            {
                type: Schema.Types.ObjectId,
                ref: "ListCategory",
                required: false,
                default: [],
            },
        ],
        fcmToken: {
            type: [String],
            required: false,
            default: [],
        },
        widgets: {
            type: [String],
            required: false,
            default: ["Im not stupid", "Next task"],
        },
        isNewUser: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    { timestamps: true }
);
export default model<UserType>("User", UserSchema);
