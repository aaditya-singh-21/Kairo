import { Types } from "mongoose";
import { Request } from "express";

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;

    // Quota
    credits: number;
}

export interface IAuthRequest extends Request {
    userId?: string;
}