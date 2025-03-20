import { NextResponse } from "next/server";
import { getCategory, updateCategory, deleteCategory } from "@/_actions/categoryActions";
import { auth } from "@/config/auth";

// GET /api/categories/[id] -> retrieve category data by userId
export async function GET(req, { params }) {
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const userId = session.user?.id;
        const categoryId = await params.id;
        const category = await getCategory(categoryId, userId);

        if (category?.error || !category) throw new Error("Failed to retrieve category");

        return NextResponse.json(
            { message: "Category retrieved", category },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// PUT /api/categories/[id] -> update category data
export async function PUT(req, { params }) {
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const userId = session.user?.id;
        const categoryId = await params.id;
        const { name } = await req.json();
        const updatedCategory = await updateCategory(categoryId, userId, name);

        if (updatedCategory?.error || !updatedCategory) throw new Error("Failed to update category");

        return NextResponse.json(
            { message: "Category updated", updatedCategory },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }    
}

// DELETE /api/categories/[id] -> delete category
export async function DELETE(req, { params }) {
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const userId = session.user?.id;
        const categoryId = await params.id;
        const deletedCategory = await deleteCategory(categoryId, userId);

        if (deletedCategory?.error || !deletedCategory) throw new Error("Failed to delete category");

        return NextResponse.json(
            { message: "Category deleted", deletedCategory },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}