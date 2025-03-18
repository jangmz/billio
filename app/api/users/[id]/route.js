import { NextResponse } from "next/server";
import { getUserById, updateUserById, deleteUserById } from "@/_actions/userActions";

// GET /api/users/[id] -> retrieve user data
export async function GET(req, { params }) {
    try {
        // check session -> session.user.id must be the same as params.id

        const userId = await params.id;
        console.log("User ID: ", userId);

        const user = await getUserById(userId);

        if (user.error) throw new Error(`No user found with ID ${userId}`);

        return NextResponse.json(
            { message: "User data retrieved", user },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );        
    }
}

// PUT /api/users/[id] -> update user data
export async function PUT(req, { params }) {
    try {
        // check session -> session.user.id must be the same as params.id

        const userId = await params.id;
        const userData = await req.json(); // name, email

        console.log("User to update: ", userId);
        console.log("User data: ", userData);

        const updatedUser = await updateUserById(userId, userData);

        if (updatedUser.error) throw new Error(`No user found with ID ${userId}`);

        return NextResponse.json(
            { message: "User data updated", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/users/[id] -> delete user data
export async function DELETE(req, { params }) {
    try {
        // check session -> session.user.id must be the same as params.id
        
        const userId = await params.id;

        console.log("User to delete", userId);

        const deletedUser = await deleteUserById(userId);

        if (deletedUser.error) throw new Error(`No user found with ID ${userId}`);

        return NextResponse.json(
            { message: "User deleted", deletedUser },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}