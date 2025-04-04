import { NextResponse } from "next/server";

export async function GET(req) {
    console.log("Cookies in test route:", req.cookies);
    return NextResponse.json({ message: "Test successful" });
}