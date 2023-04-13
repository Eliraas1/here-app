import moment from "moment";
import { Schema, model, Document } from "mongoose";
import { ListItemType } from "./ListItem";

export interface ListType extends Document {
    _id?: string;
    title?: string;
    flag?: boolean;
    details?: ListItemType[];
}
// export interface BodyTaskType {
//     _id?: string;
//     name?: string;
//     done?: boolean;
//     details?: string;
//     push?: boolean;
//     targetDate?: Date;
//     endDate?: Date;
//     isSetTime?: boolean;
// }
const ListSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        details: [
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
    },
    { timestamps: true }
);

// const formattedDate = moment(task.targetDate).format("MM/DD/YYYY");
export default model<ListType>("List", ListSchema);
