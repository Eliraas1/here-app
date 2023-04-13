import { Schema, model, Document } from "mongoose";
import { TaskType } from "./Task";
import { ListCategoryType } from "./ListCategory";
export interface UserType extends Document {
    _id?: string;
    name: string;
    email: string;
    password: string;
    img?: string;
    tasks?: TaskType[];
    listCategories: ListCategoryType[];
}
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
        listCategories: [
            {
                type: Schema.Types.ObjectId,
                ref: "ListCategory",
                required: false,
                default: [],
            },
        ],
    },
    { timestamps: true }
);
export default model<UserType>("User", UserSchema);
