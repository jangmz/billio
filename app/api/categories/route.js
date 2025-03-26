import { NextResponse } from "next/server";
import { insertCategory, getCategories } from "@/_actions/categoryActions";
import { authenticate } from "@/config/authMiddleware";

// POST /api/categories -> insert new category
export async function POST(req) {
    const user = await authenticate(req);

    if (user instanceof NextResponse) return user; // if the returned value is NextResponse, return that authentication error
    
    try {       
        const categoryData = await req.json(); // name
        categoryData.userId = user.id; 

        const category = await insertCategory(categoryData);

        if (category?.error || !category) throw new Error("Failed to create a new category");

        return NextResponse.json(
            { message: "Category created", category },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// GET /api/categories -> list all user categories
export async function GET(req) {
    const user = await authenticate(req);

    if (user instanceof NextResponse) return user; // if the returned value is NextResponse, return that authentication error
    
    try {
        const userId = user.id;
        const categories = await getCategories(userId);

        if (categories?.error || !categories) throw new Error("Failed to retrieve user categories");

        return NextResponse.json(
            { message: "Categories retrieved", categories },
            { status:200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}