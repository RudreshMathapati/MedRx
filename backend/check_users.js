import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/hospitalDB").then(async () => {
    console.log("Connected to MongoDB.");
    
    const db = mongoose.connection.db;

    // Find all users
    const users = await db.collection("users").find({}).toArray();
    console.log("Users:", users);

    mongoose.disconnect();
    console.log("Migration complete.");
}).catch(err => {
    console.error("Migration failed:", err);
});
