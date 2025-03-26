import { NextResponse } from "next/server";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function authenticate(req) {
    try {
        const session = await auth();
        
        if (!session) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 401 }
            );
            // or redirect to login page
            //redirect("/login");
        }

        // return user data if authenticated
        return session.user;
    } catch (error) {
        return NextResponse.json(
            { error: "Authentication error" },
            { status: 500 }
        );
    }
}