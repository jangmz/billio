import { NextResponse } from "next/server";
import { insertCategory, getCategories, getCategoryByName } from "@/_actions/categoryActions";
import { validateSession } from "@/config/validateSession";
import { checkRateLimit } from "@/config/checkRateLimit";

// POST /api/categories -> insert new category
export async function POST(req) {
    // rate limit check
    const rate = await checkRateLimit(req);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        );
    }

    try {       
        // validate session
        const session = await validateSession();

        const categoryData = await req.json(); // name
        categoryData.userId = session.user.id; 

        const categoryExists = await getCategoryByName(categoryData.name, categoryData.userId);

        console.log("Category exists:",categoryExists);

        if (categoryExists) {
            throw new Error("Category already exists!");
        }

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
    // rate limit check
    const rate = await checkRateLimit(req);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        );
    }

    try {
        // validate session
        const session = await validateSession();

        const userId = session.user.id;
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