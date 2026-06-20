const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET || "kairo-secret-key");
console.log(token);
