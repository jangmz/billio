import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI environment variable missing.");
}

async function connectDB() {
    if (mongoose.connections[0].readyState) {
        return true;
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
        return true;
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;