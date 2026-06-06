import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { POST } from "../controllers/generation.controller";


const router = Router();

router.post("/generate", protect, POST)

export default router