"use server";

import User from "@/models/userModel";
import connectDB from "@/config/connectDB";

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

// retrieve user by email
export async function getUser(email) {
    try {
        await connectDB();
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        return { error: error.message };
    }
}

// retrieve user by id
export async function getUserById(id) {
    try {
        await connectDB();
        const user = await User.findById(id);
        return user;
    } catch (error) {
        return { error: error.message };
    }
}

// update user by id
export async function updateUserById(id, userData) {
    try {
        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(
            id, // _id of the document to update
            userData, // update operation -> data that have values will be updated
            { new: true } // option to return the updated document
        );        
        return updatedUser;
    } catch (error) {
        return { error: error.message };
    }
}

// delete user by id
export async function deleteUserById(userId) {
    try {
        await connectDB();
        const deletedUser = await User.findByIdAndDelete(userId);
        return deletedUser;
    } catch (error) {
        return { error: error.message };
    }
}