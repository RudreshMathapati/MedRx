import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Hospital from "./models/Hospital.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to MongoDB Atlas.");

    // 1. Get or create a hospital
    let hospital = await Hospital.findOne({ status: "active" });
    if (!hospital) {
        hospital = new Hospital({
            name: "Test Hospital",
            address: "123 Test St",
            contactNumber: "+15555555555",
            status: "active"
        });
        await hospital.save();
        console.log("Created a test hospital:", hospital._id);
    } else {
        console.log("Found existing active hospital:", hospital.name, hospital._id);
    }

    // 2. Create test@gmail.com doctor
    const pass1 = await bcrypt.hash("test@123", 10);
    await User.findOneAndUpdate(
        { email: "test@gmail.com" },
        {
            name: "Test Doctor 1",
            password: pass1,
            role: "doctor",
            hospitalId: hospital._id,
            isApproved: true,
            isBlocked: false,
            isActive: true
        },
        { upsert: true, new: true }
    );
    console.log("Seeded user test@gmail.com (password: test@123)");

    // 3. Create test2@gmail.com doctor
    const pass2 = await bcrypt.hash("test2@123", 10);
    await User.findOneAndUpdate(
        { email: "test2@gmail.com" },
        {
            name: "Test Doctor 2",
            password: pass2,
            role: "doctor",
            hospitalId: hospital._id,
            isApproved: true,
            isBlocked: false,
            isActive: true
        },
        { upsert: true, new: true }
    );
    console.log("Seeded user test2@gmail.com (password: test2@123)");

    mongoose.disconnect();
    console.log("Seeding complete.");
}).catch(err => {
    console.error("Failed:", err);
});
