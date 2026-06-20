import mongoose from "mongoose";
import { ProjectModel } from "./models/project.model";
import { UserModel } from "./models/user.model";
require("dotenv").config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/kairo");
  const user = await UserModel.findOne();
  console.log("User:", user?.email, user?.credits);
  const projects = await ProjectModel.find({ owner: user?._id }).sort({ createdAt: -1 }).limit(3);
  for (const p of projects) {
    console.log("Project:", p._id, p.name, "currentCode length:", p.currentCode?.length || 0);
  }
  mongoose.disconnect();
}
run();
