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
        await createdUser.save();
        return createdUser;
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
export const replaceFcmToken = async (
    _id: string,
    oldToken?: string,
    newToken?: string
) => {
    try {
        const user = await User.findById(_id);
        if (!user) throw new Error("user not found");
        const tokenIndex = user?.fcmToken.findIndex(
            (token) => token === oldToken
        );
        if (!newToken) {
            user.fcmToken = user.fcmToken.filter((token) => token !== oldToken);
            await user.save();
            return user;
        }
        const isTokenExist = user?.fcmToken.includes(newToken);
        if (isTokenExist) throw new Error("token already exist");

        if (~tokenIndex) {
            if (!newToken) {
                user.fcmToken = user.fcmToken.filter(
                    (token) => token !== oldToken
                );
                await user.save();
                return user;
            }
            user.fcmToken[tokenIndex] = newToken;
            await user.save();
            return user;
        }
        if (!newToken) return user;
        user.fcmToken.push(newToken);
        await user.save();
        return user;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
};
