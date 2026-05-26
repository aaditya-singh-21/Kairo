import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes 
app.get("/", (_req, res) => {
    res.send("API Running");
});

app.use("/api/auth", authRoutes);

// Database + Server 
const MONGO_URI = process.env.MONGO_URI as string;
const PORT = process.env.PORT || 5000;

mongoose
    .connect(MONGO_URI)
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