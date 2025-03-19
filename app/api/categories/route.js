import { NextResponse } from "next/server";
import { insertCategory, getCategories } from "@/_actions/categoryActions";

// POST /api/categories -> insert new category
export async function POST(req) {
    try {
        const categoryData = await req.json(); // name
        categoryData.userId = "67d2ab0cb46d21c7763f9ab3"; // retrieve userId from session
        const category = await insertCategory(categoryData);

        if (category?.error || !category) throw new Error("Failed to create a new category");

        return NextResponse.json(
            { message: "Category created", category },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// GET /api/categories -> list all user categories
export async function GET(req) {
    try {
        const userId = "67d2ab0cb46d21c7763f9ab3"; // retrieve userId from session
        const categories = await getCategories(userId);

        if (categories?.error || !categories) throw new Error("Failed to retrieve user categories");

        return NextResponse.json(
            { message: "Categories retrieved", categories },
            { status:200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}