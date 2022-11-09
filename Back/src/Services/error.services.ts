import { Response, Request, NextFunction } from "express";
interface ErrorWithStatusType extends Error {
    status?: number;
}
class ErrorWithStatus extends Error {
    status?: number;
}

export const errorHandling = (
    err: ErrorWithStatusType | any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
};

export const createError = (status: number, message: string) => {
    // return new Error(err, message);
    const error = new ErrorWithStatus();
    error.message = message;
    error.status = status;

    return error;
};
