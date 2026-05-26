import mongoose, { Schema } from "mongoose";
import { IProject, ICodeVersion } from "../Interfaces/project.interface";

// Sub-document schema for a single code version
const CodeVersionSchema = new Schema<ICodeVersion>(
    {
        code: {
            type: String,
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        versionNumber: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: () => new Date(),
        },
    },
    { _id: false } // no separate _id for sub-documents
);

// Main Project schema
const ProjectSchema = new Schema<IProject>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        currentCode: {
            type: String,
            default: "",
        },
        versionHistory: {
            type: [CodeVersionSchema],
            default: [],
        },
        usedCredits: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ["active", "archived", "deleted"],
            default: "active",
        }
    },
    {
        timestamps: true,
    }
);

// ── Compound index for listing a user's active projects efficiently ──────────
ProjectSchema.index({ owner: 1, status: 1, createdAt: -1 });

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);