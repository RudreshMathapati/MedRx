import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to MongoDB Atlas.");
    const users = await User.find({}, { name: 1, email: 1, role: 1, isApproved: 1, isBlocked: 1 });
    console.log("Users in Database:");
    console.log(users);
    mongoose.disconnect();
}).catch(err => {
    console.error("Failed:", err);
});
