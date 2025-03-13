"use server";

import Category from "@/models/categoryModel";
import connectDB from "@/config/mongodb";

// inserting a new category
export async function insertCategory(category) {
    try {
        await connectDB();
        const newCategory = new Category(category);
        const savedCategory = await newCategory.save();

        return savedCategory;
    } catch (error) {
        return { error: error.message };
    }
}

// retrieving all user categories
export async function getCategories(userId) {
    try {
        await connectDB();
        const categories = await Category.find({ userId });

        return categories;
    } catch (error) {
        return { error: error.message };
    }
}