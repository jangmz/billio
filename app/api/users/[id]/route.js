import { NextResponse } from "next/server";
import { getUserById, updateUserById, deleteUserById } from "@/_actions/userActions";
import { validateSession } from "@/config/validateSession";

// GET /api/users/[id] -> retrieve user data
export async function GET(req, { params }) {
    // validate session
    const session = await validateSession();

    try {
        const userId = await params.id;
        
        // check if logged user is the same as for which it wants to retrieve data
        if (userId !== session.user.id) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const user = await getUserById(userId);

        if (user?.error || !user) throw new Error(user?.error || `No user found with ID ${userId}`);

        return NextResponse.json(
            { message: "User data retrieved", user },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );        
    }
}

// PUT /api/users/[id] -> update user data
export async function PUT(req, { params }) {
    // validate session
    const session = await validateSession();

    try {
        const userId = await params.id;

        // check if logged user is the same as for which it wants to update data
        if (userId !== session.user.id) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const userData = await req.json(); // name, email
        const updatedUser = await updateUserById(userId, userData);

        if (updatedUser?.error || !updatedUser) throw new Error(updatedUser?.error || `Could not update data for user with ID ${userId}`);

        return NextResponse.json(
            { message: "User data updated", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// DELETE /api/users/[id] -> delete user data
export async function DELETE(req, { params }) {
    // validate session
    const session = await validateSession();

    try {
        const userId = await params.id;

        // check if logged user is the same as for which it wants to retrieve data
        if (userId !== session.user.id) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const deletedUser = await deleteUserById(userId);

        if (deletedUser?.error || !deletedUser) throw new Error(deletedUser?.error || `Could not delete user with ID ${userId}`);

        return NextResponse.json(
            { message: "User deleted", deletedUser },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}