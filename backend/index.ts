import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import generationRoutes from "./routes/generation.routes";


const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());

// Routes 
app.get("/", (_req, res) => {
    res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", generationRoutes);

// Database + Server 
const MONGO_URL = process.env.MONGO_URL as string;
const PORT = process.env.PORT || 5000;

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });