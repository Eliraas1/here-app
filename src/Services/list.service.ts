import ListCategory from "../Models/ListCategory";
import User from "../Models/User";

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
    );
    return user;
};
export const getListCategory = async (userId: string) => {
    const user = await User.findById(userId).populate("listCategories");
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
    );
    await ListCategory.deleteOne({ _id: categoryId });
    return user;
};
export const editListCategory = async (categoryId: string, name: string) => {
    const newCategory = await ListCategory.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
    );
    return newCategory;
};
