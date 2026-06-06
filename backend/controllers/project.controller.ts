import { Response } from "express";
import { IAuthRequest } from "../Interfaces/user.interface";
import { ProjectModel } from "../models/project.model";
import { UserModel } from "../models/user.model";


export async function getAllProjects(req: IAuthRequest, res: Response) {
    try {
        const response = await ProjectModel.find({ owner: req.userId })
        return res.status(200).json({
            response
        })
    }
    catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}

export const getProjectById = async (req: IAuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const response = await ProjectModel.findById(projectId);
        if (!response) {
            return res.status(404).json({
                msg: "Invalid projectId"
            })
        }
        if (response.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Forbidden" })
        }

        res.status(200).json({
            response
        })
    }
    catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}

export const updateProjectName = async (req: IAuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const { name } = req.body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ msg: "A valid project name is required." });
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: "Project not found." });
        }

        if (project.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Forbidden." });
        }

        project.name = name.trim();
        await project.save();

        res.status(200).json({ msg: "Project renamed successfully.", project });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong." });
    }
};

export const deleteProject = async (req: IAuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: "Project not found." });
        }

        if (project.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Forbidden." });
        }

        await project.deleteOne();

        res.status(200).json({ msg: "Project deleted successfully." });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong." });
    }
};