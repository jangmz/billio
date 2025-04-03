import { NextResponse } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = [
    "/dashboard",
    "/api/bills",
    "/api/categories",
    "/api/residences",
    "/api/users",
    "/api/reports",
    "/api/debug-token"
];

export default async function middleware(req) {
    const session = await auth();
    const { pathname } = req.nextUrl; // current pathname

    // check if current route is protected
    const isProtected = protectedRoutes.some((route) => 
        pathname.startsWith(route)
    );

    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}