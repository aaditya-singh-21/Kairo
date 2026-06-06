import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router()

router.get("/project", protect)
router.get("/project/:projectId", protect)
router.patch("/project/:projectId", protect)
router.delete("/project/:projectId", protect)