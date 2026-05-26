import { Types } from "mongoose";

export type ProjectStatus = "active" | "archived" | "deleted";

export interface ICodeVersion {
    code: string;
    prompt: string;        // the prompt that produced this version
    versionNumber: number;
    createdAt: Date;
}

export interface IProject {
    owner: Types.ObjectId;
    name: string;
    description?: string;
    currentCode: string;
    versionHistory: ICodeVersion[];
    usedCredits: number;
    status: ProjectStatus;
}