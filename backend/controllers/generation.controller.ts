import { Response } from "express";
import { generateCode } from "../services/generation.service";
import { IAuthRequest } from "../Interfaces/user.interface";
import { UserModel } from "../models/user.model";
import { ProjectModel as Project } from "../models/project.model";

// Strip opening/closing markdown code fences that the AI sometimes wraps output in.
// e.g. ```tsx\n...code...\n``` → just the code inside
function stripMarkdownFences(code: string): string {
    return code
        .replace(/^```[\w]*\n?/m, '')   // opening fence: ```jsx, ```tsx, ```javascript etc.
        .replace(/export\s+default\s+App;?/g, '')        // closing fence
        .trim();
}

export async function POST(req: IAuthRequest, res: Response) {
    let isAborted = false;
    // Only listen to res 'close' — this fires when the CLIENT drops the connection
    // while we are actively streaming the response back (the correct SSE disconnect signal).
    // Do NOT use req.on('close'): express.json() destroys the IncomingMessage stream after
    // reading the request body, which fires 'close' on req for every normal request.
    res.on('close', () => {
        // This is expected on normal completion — the frontend navigates away when it
        // receives the 'done' event, which closes the SSE connection.
        // DB saves and credit deduction are NOT gated on this flag, so nothing is lost.
        console.log('[generation.controller] SSE connection closed (expected if client received done event)');
        isAborted = true;
    });

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


        if (!apiKey && user.credits < 2) {
            return res.status(403).json({
                error: "Insufficient credits. Please upgrade your plan or provide your own API key."
            });
        }

        console.log('[generation.controller] Pre-stream check: isAborted =', isAborted, '| req.destroyed =', req.destroyed);
        if (isAborted) {
            console.log('[generation.controller] Client aborted before stream started. Stopping.');
            return;
        }

        res.setHeader("Content-Type", 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        res.flushHeaders()
        res.write(`data: ${JSON.stringify({ projectId: project._id.toString() })}\n\n`)
        const code = generateCode(prompt, project.currentCode || undefined, apiKey);
        let fullCode = ""

        for await (const chunk of code) {
            if (isAborted) {
                console.log('[generation.controller] Client aborted the request mid-stream. Stopping generation.');
                res.end();
                return;
            }
            fullCode += chunk
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
        }

        const cleanCode = stripMarkdownFences(fullCode);
        res.write(`data: ${JSON.stringify({ done: true, code: cleanCode })}\n\n`);

        // Always save and deduct credits when streaming completed normally (unless BYOK).
        // Do NOT gate this on isAborted — the client navigating away on the 'done' event
        // fires res.on('close') which sets isAborted=true, but the work is already done.
        if (!apiKey) {
            await UserModel.findByIdAndUpdate(req.userId, { $inc: { credits: -2 } });
        }

        await Project.findByIdAndUpdate(project._id, {
            currentCode: cleanCode,
            $push: {
                versionHistory: {
                    code: cleanCode,
                    prompt,
                    versionNumber: project.versionHistory.length + 1,
                }
            }
        });

        if (!apiKey) {
            console.log(`[generation.controller] ✅ Generation complete — project ${project._id} saved, credits deducted`);
        } else {
            console.log(`[generation.controller] ✅ Generation complete — project ${project._id} saved, BYOK used (no credits deducted)`);
        }
        res.end();
    } catch (error) {
        console.error('[generation.controller] Error:', error)
        res.write(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`)
        res.end()
    }
}