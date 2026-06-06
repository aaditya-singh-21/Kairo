import { Response } from "express";
import { generateCode } from "../services/generation.service";
import { IAuthRequest } from "../Interfaces/user.interface";
import { UserModel } from "../models/user.model";
import { ProjectModel as Project } from "../models/project.model";
export async function POST(req: IAuthRequest, res: Response) {
    try {
        const { prompt, projectId, apiKey } = req.body;
        if (!prompt) {
            return res.status(400).json({
                msg: "Prompt is required"
            })
        }
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized: User ID required" });
        }
        let project;
        if (projectId) {
            project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ error: "Invalid project Id" })
            if (project.owner.toString() !== req.userId) return res.status(403).json({ error: "Forbidden" })
        } else {
            project = await Project.create({
                owner: req.userId,
                name: prompt.slice(0, 50),
                currentCode: "",
                versionHistory: [],
            })
        }


        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        if (user.credits < 2) {
            return res.status(403).json({
                error: "Insufficient credits. Please upgrade your plan."
            });
        }

        res.setHeader("Content-Type", 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        res.flushHeaders()

        const code = generateCode(prompt, project.currentCode || undefined, apiKey);
        let fullCode = ""

        for await (const chunk of code) {
            fullCode += chunk
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`)


        // deducting the credits here
        await UserModel.findByIdAndUpdate(req.userId, { $inc: { credits: - 2 } })
        await Project.findByIdAndUpdate(project._id, {
            currentCode: fullCode,
            $push: {
                versionHistory: {
                    code: fullCode,
                    prompt,
                    versionNumber: project.versionHistory.length + 1,
                }
            }
        })
        res.end()
    } catch (error) {
        res.write(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`)
        res.end()
    }
}