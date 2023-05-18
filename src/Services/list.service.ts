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
            options: {
                sort: { createdAt: -1 },
            },
            populate: {
                path: "lists",
                options: {
                    sort: { flag: -1, createdAt: -1 },
                },
                populate: {
                    path: "listItems",
                },
            },
        })
        .select("-password");
    const categories = user?.listCategories;
    return categories;
};
export const getPrioritizedLists = async (userId: string) => {
    const user = await User.findById(userId)
        .populate({
            path: "listCategories",
            options: {
                sort: { createdAt: -1 },
            },
            populate: {
                path: "lists",
                options: {
                    sort: { flag: -1, createdAt: -1 },
                },
                populate: {
                    path: "listItems",
                },
            },
        })
        .select("-password");
    const categories = user?.listCategories;
    const allLists = getAllListFromCategories(categories);
    const prioritizeLists = prioritizeList(allLists);
    return prioritizeLists;
};

const getAllListFromCategories = (categories?: ListCategoryType[]) => {
    const newList: ListType[] = [];
    if (!categories) return newList;
    categories.forEach((category) => {
        category.lists?.forEach((list) => {
            const updatedList = {
                _id: list._id,
                title: list.title,
                listItems: list.listItems,
                flag: list.flag,
                checkBoxListType: list.checkBoxListType,
                createdAt: list.createdAt,
                categoryId: category._id,
            };
            newList.push(updatedList as any);
        });
    });
    return newList;
};
const prioritizeList = (listArray: ListType[]) => {
    return listArray.sort((a, b) => {
        if (a.flag && !b.flag) {
            return -1;
        }
        if (!a.flag && b.flag) {
            return 1;
        }
        return b.createdAt?.getTime() - a.createdAt?.getTime();
    });
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
export const deleteCategories = async (
    userId: string,
    categoryIds: string[]
) => {
    // Remove categories from the User model
    await User.findByIdAndUpdate(
        userId,
        { $pull: { listCategories: { $in: categoryIds } } },
        { new: true }
    );
    return await ListCategory.deleteMany({ _id: { $in: categoryIds } });
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
export const editListFlag = async (listId: string, flag: boolean) => {
    const updatedList = await List.findByIdAndUpdate(
        listId,
        { flag },
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
    items: ListItemTypeBody[],
    deleted: ListItemTypeBody[]
) => {
    const stack: string[] = [];
    for (let index = 0; index < items.length; index++) {
        const _item = await addOrUpdateItemToList(items[index]);
        if (!_item) continue;
        stack.push(_item._id);
    }
    // deleted?.forEach((item) => deleteItemInList(item));
    deleteManyItemsInList(deleted);
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
    if (!item.new) {
        const id = item._id;
        delete item._id;
        const updatedItem = await ListItem.findByIdAndUpdate(id, item, {
            new: true,
        });
        return updatedItem;
    }
    if (!item.description) {
        console.log("not add");
        return;
    }

    delete item._id;
    const newItem = new ListItem(item);
    const savedItem = await newItem.save();
    return savedItem;
};
export const deleteItemInList = async (itemId: string) => {
    const deletedItem = await ListItem.deleteOne({ _id: itemId });
    return deletedItem;
};
export const deleteManyItemsInList = async (items: ListItemTypeBody[]) => {
    const idsToDelete = items.map((item) => item._id);

    const deletedItems = await ListItem.deleteMany({
        _id: { $in: idsToDelete },
    });
    return deletedItems;
};
