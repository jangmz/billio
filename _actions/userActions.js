"use server";

import User from "@/models/userModel";
import connectDB from "@/config/mongodb";

// insert user
export async function insertUser(userData) {
    try {
        await connectDB();        
        const newUser = new User(userData);
        const savedUser = newUser.save();

        console.log("User saved");
        return savedUser;
    } catch (error) {
        return { error: error.message };
    }
}

// retrieve user by email
export async function getUser(email) {
    try {
        await connectDB();
        const user = await User.findOne({ email });

        console.log("User found already exists");
        return user;
    } catch (error) {
        return { error: error.message };
    }
}