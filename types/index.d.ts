import * as express from "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any;
            refresh: {
                accessToken: string;
                refreshToken: string;
                status: number;
            };
            // flash(): { [key: string]: string[] };
            // flash(message: string): string[];
            // flash(type: string, message: string[] | string): number;
            // flash(type: string, format: string, ...args: any[]): number;
            // logout(): void;
        }
    }
}
