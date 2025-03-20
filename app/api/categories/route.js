import { NextResponse } from "next/server";
import { insertCategory, getCategories } from "@/_actions/categoryActions";
import { auth } from "@/config/auth";

// POST /api/categories -> insert new category
export async function POST(req) {
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        
        const categoryData = await req.json(); // name
        categoryData.userId = session.user?.id; 

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
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const userId = session.user?.id;
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