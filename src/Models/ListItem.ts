import { Schema, model, Document } from "mongoose";
export type CheckBoxListType = "NUMBERS" | "DOTS" | "V" | "NONE";

export interface ListItemType extends Document {
    _id?: string;
    description?: string;
    done?: boolean;
    flag?: boolean;
}
export interface ListItemTypeBody {
    _id?: string;
    description?: string;
    done?: boolean;
    flag?: boolean;
}
const ListItemSchema = new Schema(
    {
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
    },
    { timestamps: true }
);

export default model<ListItemType>("ListItem", ListItemSchema);
