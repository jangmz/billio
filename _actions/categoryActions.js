"use server";

import Category from "@/models/categoryModel";
import connectDB from "@/config/connectDB";

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

// retrieve category data by id and userid
export async function getCategory(categoryId, userId) {
    try {
        await connectDB();
        const category = await Category.findOne({ _id: categoryId, userId });
        return category;
    } catch (error) {
        return { error: error.message };
    }
}

// retrieve category by name and user id
export async function getCategoryByName(categoryName, userId) {
    try {
        await connectDB();
        const category = await Category.findOne({ name: categoryName, userId });
        return category
    } catch (error) {
        return { error: error.message };
    }
}

// update category data by id and userid
export async function updateCategory(categoryId, userId, name) {
    try {
        await connectDB();
        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, userId },
            { name },
            { new: true }
        );
        return updatedCategory;
    } catch (error) {
        return { error: error.message };
    }
}

// delete category by id and userid
export async function deleteCategory(categoryId, userId) {
    try {
        await connectDB();
        const deletedCategory = await Category.findOneAndDelete({ _id: categoryId, userId });
        return deletedCategory;
    } catch (error) {
        return { error: error.message };
    }
}