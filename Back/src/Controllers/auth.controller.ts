import { Request, Response, NextFunction } from "express";
import { createUser, getUserByEmail } from "../Services/user.services";
import { genSalt, hash, compareSync, hashSync } from "bcrypt";
import { UserType } from "../Models/User";
import { createError } from "../Services/error.services";
export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;
        const user = await getUserByEmail(email);

        if (user) return next(createError(400, "Email is already in use"));
        const salt = await genSalt();
        const hashedPassword = await hash(password, salt);

        const userFields: any = {
            name,
            email,
            password: hashedPassword,
        };
        const createdUser = await createUser(userFields);
        return res.status(200).json({
            success: true,
            message: "Registration Success",
            data: createdUser,
        });
    } catch (error: any) {
        next(error);
    }
};
