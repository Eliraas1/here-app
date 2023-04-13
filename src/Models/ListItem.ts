import { Schema, model, Document } from "mongoose";
export type CheckBoxListType = "NUMBERS" | "DOTS" | "V" | "NONE";

export interface ListItemType extends Document {
    _id?: string;
    description?: string;
    done?: boolean;
    flag?: boolean;
    checkBoxListType?: CheckBoxListType;
}
const ListItemSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        done: {
            type: Boolean,
            default: false,
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
    },
    { timestamps: true }
);

export default model<ListItemType>("ListItem", ListItemSchema);
