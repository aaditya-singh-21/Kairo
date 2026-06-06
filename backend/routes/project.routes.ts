import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { deleteProject, getAllProjects, getProjectById, updateProjectName } from "../controllers/project.controller";

const router = Router()

router.get("/project", protect, getAllProjects)
router.get("/project/:projectId", protect, getProjectById)
router.patch("/project/:projectId", protect, updateProjectName)
router.delete("/project/:projectId", protect, deleteProject)

export default router;