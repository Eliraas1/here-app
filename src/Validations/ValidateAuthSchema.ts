import joi from "joi";

interface LoginSchema {
    email: string;
    password: string;
}

const loginSchema = joi.object().keys({
    email: joi
        .string()
        .email({ minDomainSegments: 2 })
        .error(Error("אימייל או סיסמה לא תקינים")),
    password: joi
        .string()
        .required()
        .min(8)
        .error(Error("אימייל או סיסמה לא תקינים")),
    // name: joi.string().required().min(2).error(Error("שם לא חוקי")),
});

export const validateLoginSchema = (body: LoginSchema) => {
    const result = loginSchema.validate(body);
    return result;
};
