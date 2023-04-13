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
        flag: {
            type: Boolean,
            default: false,
        },
        checkBoxListType: {
            type: String,
            required: false,
            default: "V",
        },
    },
    { timestamps: true }
);

// const formattedDate = moment(task.targetDate).format("MM/DD/YYYY");
export default model<ListType>("List", ListSchema);
