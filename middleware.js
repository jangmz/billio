export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";

const protectedRoutes = [
    "/dashboard",
    "/api/bills",
    "/api/categories",
    "/api/residences",
    "/api/users",
    "/api/reports"
];

export default async function middleware(req) {
    //const cookieStore = cookies();
    //const sessionToken = cookieStore.get("authjs.session-token")?.value;

    const session = await auth(); //await auth({ token: sessionToken });
    const { pathname } = req.nextUrl; // current pathname

    // check if current route is protected
    const isProtected = protectedRoutes.some((route) => 
        pathname.startsWith(route)
    );

    if (isProtected && !session) {
        console.log("Redirect to /login due to missing session");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}