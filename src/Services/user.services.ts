import User, { UserType } from "../Models/User";

export const getUserByEmail = async (
    email: string,
    password: boolean = false
): Promise<UserType> => {
    let user;
    try {
        if (password) {
            user = await User.findOne({
                email,
            })
                .select("+password")
                .populate(["tasks"]);
        } else {
            user = await User.findOne({
                email,
            }).populate(["tasks"]);
        }
        return user as UserType;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getUserById = async (userId: string) => {
    try {
        const user = await User.findOne({
            userId,
        }).populate(["tasks"]);
        return user;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};

export const createUser = async (user: UserType) => {
    try {
        const createdUser = new User({
            ...user,
            email: user.email.toLowerCase(),
        });
        return await createdUser.save();
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
