import { Schema, model, Document, Types } from "mongoose";
import { ListType } from "./List";

export interface ListCategoryType extends Document {
    _id?: string;
    name?: string;
    lists?: ListType[];
}
const ListCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lists: [
            {
                type: Schema.Types.ObjectId,
                ref: "List",
                required: false,
                default: [],
            },
        ],
    },
    { timestamps: true }
);

export default model<ListCategoryType>("ListCategory", ListCategorySchema);
