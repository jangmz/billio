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
    const isProtected = protectedRoutes.some((route) => 
        pathname.startsWith(route)
    );

    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

/*import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    console.log("============Middleware============")

    const cookie = req.cookies.get("authjs.session-token")?.value;
    console.log("Cookie:", cookie);

    const token = await getToken({ req, secret: process.env.AUTH_SECRET, cookie });
    console.log("Token:", token);

    if (!token) {
        // return NextResponse.redirect(new Url("/login", req.url));
        return NextResponse.json(
            { message: "Not authorized" },
            { status: 403 }
        );
    }

    return NextResponse.next();
}
*/
/*export const config = {
    // these routes are protected
    matcher: ["/dashboard/:path*", "/api/:path*"] 
};*/