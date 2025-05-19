import { insertUser, getUser } from "@/_actions/userActions";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// POST /api/auth/register -> for login credentials
export async function POST(req) {
    try {
        // validate that request has a body
        if (!req.body) {
            return NextResponse.json(
                { error: "Request body required" },
                { status: 400 }
            );
        }

        // check if request body is valid JSON
        let body;
        try {
            body = await req.json();
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid JSON in request" },
                { status: 400 }
            )
        }
        
        const { name, email, password } = body;
        
        // check if user exists
        const existingUser = await getUser(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }
        console.log("User does not exist");

        // hash password and insert user
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed");
        const res = await insertUser({ name, email, password: hashedPassword });
    
        if (res.error) {
            return NextResponse.json(
                { error: res.error },
                { status: 400 }
            );
        }
    
        return NextResponse.json(
            { user: res, message: "User created" },
            { status: 201 }
        );
    } catch(error) {
        return NextResponse.json(
            { error: error.message || "Internal server error"},
            { status: 500 }
        );
    }
    
}