import User, { UserType } from "../Models/User";

export const getUserByEmail = async (
    emailAddress: string,
    password: boolean = false
): Promise<UserType> => {
    let user;
    const email = emailAddress.toLowerCase().trim();
    try {
        if (password) {
            user = await User.findOne({
                email,
            }).select("+password");
            // .populate(["tasks"]);
        } else {
            user = await User.findOne({
                email,
            });
            // .populate(["tasks"]);
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
export const updateUser = async (user: UserType) => {
    try {
        await User.updateOne({ email: user.email.toLowerCase() }, { ...user });
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const getMyProfile = async (_id: string) => {
    try {
        const user = await User.findOne({ _id }).select("name email tasks");
        return { ...JSON.parse(JSON.stringify(user)), signIn: true };
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
export const setFcmToken = async (_id: string, token: string) => {
    try {
        console.log({ token });
        const user = await User.findOneAndUpdate(
            { _id },
            {
                $addToSet: { fcmToken: token },
            },
            { new: true }
        );
        return user;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
