"use server";

import User from "@/models/userModel";
import connectDB from "@/config/mongodb";

export async function getUsers() {
    try {
        await connectDB();
        const data = await User.find();

        return { data };
    } catch (error) {
        return { error: error.message };
    }
}