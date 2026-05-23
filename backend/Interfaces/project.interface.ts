import { Types } from "mongoose";

export interface IProject {
    usedCredits : number,
    owner : Types.ObjectId,
    currentCode : string,
    promptHistory : string[],
    versionHistory : string[],
    name : string
}