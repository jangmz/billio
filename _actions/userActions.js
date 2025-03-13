"use server";

import User from "@/models/userModel";
import connectDB from "@/config/mongodb";

// insert user
export async function insertUser(userData) {
    try {
        await connectDB();
        const newUser = new User(userData);
        const savedUser = newUser.save();

        return savedUser;
    } catch (error) {
        return { error: error.message };
    }
}

// retrieve all users
export async function getUsers() {
    try {
        await connectDB();
        const data = await User.find();

        return { data };
    } catch (error) {
        return { error: error.message };
    }
}