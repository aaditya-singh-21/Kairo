import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "./models/user.model";
require("dotenv").config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL || "");
  const user = await UserModel.findOne();
  if (user) {
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || "Secret123");
    console.log("TOKEN=" + token);
  }
  mongoose.disconnect();
}
run();
