import { createError } from "../Services/error.services";
import { NextFunction, Request, Response } from "express";

const API_KEY = process.env.API_KEY;

export const validateApiKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Check if the API key provided in the request matches the expected API key
    const providedApiKey = req.headers["x-api-key"];
    console.log({ providedApiKey });
    if (providedApiKey !== API_KEY) {
        return next(createError(401, "unauthorized access"));
    }
    next();
};
