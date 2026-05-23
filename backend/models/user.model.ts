import mongoose, { Schema } from "mongoose";
import { IUser } from "../Interfaces/user.interface";

const UserSchema = new Schema<IUser>({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    credits : {
        type : Number,
        default : 50
    }
},
{
    timestamps: true
})