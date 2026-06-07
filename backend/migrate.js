import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/hospitalDB").then(async () => {
    console.log("Connected to MongoDB.");
    
    const db = mongoose.connection.db;
    const result = await db.collection("hospitals").updateMany(
        { status: { $exists: false } },
        { $set: { status: "active" } }
    );
    console.log(`Updated ${result.modifiedCount} hospitals without a status.`);

    const hospitals = await db.collection("hospitals").find({}).toArray();
    console.log("All hospitals:", hospitals);

    mongoose.disconnect();
    console.log("Migration complete.");
}).catch(err => {
    console.error("Migration failed:", err);
});
