import { Types } from "mongoose";


export interface IUser {
    _id: Types.ObjectId,
    name: string,
    password: string,
    email: string,
    credits : number,
}