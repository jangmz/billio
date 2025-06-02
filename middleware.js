import { NextResponse } from "next/server";
//import { auth } from "@/auth";
//import { cookies } from "next/headers";
//import { getUserIP } from "./config/retrieveIp";
//import { rateLimiter } from "./config/rateLimiter";

const protectedRoutes = [
    "/dashboard",
    "/api/bills",
    "/api/categories",
    "/api/residences",
    "/api/users",
    "/api/reports"
];

export default async function middleware(req) {
    //const session = await auth(); 
    const hasSession = req.cookies.get("__Secure-authjs.session-token");
    const { pathname } = req.nextUrl; // current pathname

    // check if current route is protected
    const isProtected = protectedRoutes.some((route) => 
        pathname.startsWith(route)
    );

    if (isProtected && !hasSession) {
        if (pathname.startsWith("/api")) {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        console.log("Redirect to /login due to missing session");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}