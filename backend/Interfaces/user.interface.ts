import { Types } from "mongoose";


export interface IUser {
    _id: Types.ObjectId,
    name: string,
    password?: string,
    email: string,
    googleId?: string,
    avatar?: string,
    bio?: string,
    tech?: string[],
    socials?: {
        github?: string,
        linkedin?: string,
        portfolio?: string
    }
}