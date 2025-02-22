import { Schema, model, Document } from "mongoose";
import { ListItemType } from "./ListItem";

export type CheckBoxListType = "NUMBERS" | "DOTS" | "V" | "NONE";
export const CheckBoxListTypeArr = ["NUMBERS", "DOTS", "V", "NONE"];
export interface ListType extends Document {
    _id?: string;
    title?: string;
    flag?: boolean;
    listItems?: ListItemType[];
    checkBoxListType?: CheckBoxListType;
    categoryName?: string;
    category?: string;
    createdAt: Date;
}
const ListSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        listItems: [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref: "ListItem",
                default: [],
            },
        ],
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ListCategory",
        },

        flag: {
            type: Boolean,
            default: false,
        },
        checkBoxListType: {
            type: String,
            required: false,
            default: "V",
        },
        categoryName: {
            type: String,
            required: false,
            default: "",
        },
    },
    { timestamps: true }
);

// const formattedDate = moment(task.targetDate).format("MM/DD/YYYY");
export default model<ListType>("List", ListSchema);
