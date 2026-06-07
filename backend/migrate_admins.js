import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/hospitalDB").then(async () => {
    console.log("Connected to MongoDB.");
    
    const db = mongoose.connection.db;

    // Find hospital admins
    const admins = await db.collection("users").find({ role: "hospital_admin" }).toArray();
    console.log("Hospital Admins:", admins);

    for (const admin of admins) {
        if (admin.hospitalId) {
            const result = await db.collection("hospitals").updateOne(
                { _id: admin.hospitalId },
                { $set: { hospitalAdminId: admin._id } }
            );
            console.log(`Updated hospital ${admin.hospitalId} with admin ${admin._id}. Modified: ${result.modifiedCount}`);
        }
    }

    mongoose.disconnect();
    console.log("Migration complete.");
}).catch(err => {
    console.error("Migration failed:", err);
});
