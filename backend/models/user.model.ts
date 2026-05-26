import mongoose, { Schema } from "mongoose";
import { IUser } from "../Interfaces/user.interface";

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        credits: {
            type: Number,
            default: 50,
            min: 0,
        }
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);