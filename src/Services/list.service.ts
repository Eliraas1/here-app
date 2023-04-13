import List, { ListType } from "../Models/List";
import ListCategory, { ListCategoryType } from "../Models/ListCategory";
import User from "../Models/User";
import ListItem, {
    CheckBoxListType,
    ListItemType,
    ListItemTypeBody,
} from "../Models/ListItem";

export const addListCategory = async (userId: string, name: string) => {
    const newCategory = new ListCategory({
        name,
    });
    await newCategory.save();
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $addToSet: {
                listCategories: newCategory,
            },
        },
        { new: true }
    ).select("-password");
    return user;
};
export const getListCategory = async (userId: string) => {
    const user = await User.findById(userId)
        .populate({
            path: "listCategories",
            populate: {
                path: "lists",
                populate: {
                    path: "listItems",
                },
            },
        })
        .select("-password");
    const categories = user?.listCategories;
    return categories;
};
export const deleteListCategory = async (
    userId: string,
    categoryId: string
) => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $pull: { listCategories: categoryId },
        },
        { new: true }
    ).select("-password");
    await ListCategory.deleteOne({ _id: categoryId });
    return user;
};
export const editListCategory = async (categoryId: string, name: string) => {
    const updatedCategory = await ListCategory.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
    );
    return updatedCategory;
};

export const addListToCategory = async (categoryId: string, title: string) => {
    const newList = new List({
        title,
    });
    const savedList = await newList.save();
    const updatedCategory = await ListCategory.findByIdAndUpdate(
        categoryId,
        {
            $addToSet: {
                lists: savedList,
            },
        },
        { new: true }
    ).populate({ path: "lists" });
    return updatedCategory;
};
export const editListTitle = async (listId: string, title: string) => {
    const updatedList = await List.findByIdAndUpdate(
        listId,
        { title },
        { new: true }
    );
    return updatedList;
};
export const editListCheckBoxType = async (
    listId: string,
    checkBoxListType: CheckBoxListType
) => {
    const updatedList = await List.findByIdAndUpdate(
        listId,
        { checkBoxListType },
        { new: true }
    );
    return updatedList;
};
export const deleteList = async (listId: string) => {
    const deletedList = await List.deleteOne({ _id: listId });
    return deletedList;
};

export const addItemsToList = async (
    listId: string,
    items: ListItemTypeBody[]
) => {
    const stack: string[] = [];
    for (let index = 0; index < items.length; index++) {
        const _item = await addOrUpdateItemToList(items[index]);
        if (!_item) continue;
        stack.push(_item._id);
    }
    if (stack.length <= 0) throw new Error("must send items to list");
    const updatedList = List.findByIdAndUpdate(
        listId,
        {
            $addToSet: { listItems: { $each: stack } },
        },
        { new: true }
    );

    return updatedList;
};
const addOrUpdateItemToList = async (item: ListItemTypeBody) => {
    if (item._id) {
        const id = item._id;
        delete item._id;
        const updatedItem = await ListItem.findByIdAndUpdate(id, item, {
            new: true,
        });
        return updatedItem;
    }
    const newItem = new ListItem(item);
    const savedItem = await newItem.save();
    return savedItem;
};
export const deleteItemInList = async (itemId: string) => {
    const deletedItem = await ListItem.deleteOne({ _id: itemId });
    return deletedItem;
};
