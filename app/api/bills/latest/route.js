import { NextResponse } from "next/server";
import { getLatestBills } from "@/_actions/billActions";
import { validateSession } from "@/config/validateSession";

// /api/bills/latest -> 10 last bills from this user
export async function GET(req) {
    try {
        // validate session
        const session = await validateSession();

        const userId = session.user.id;
        const latestBills = await getLatestBills(userId)

        if (latestBills?.error || !latestBills) {
            throw new Error(latestBills?.error || "Failed to retrieve latest bills.");
        }

        return NextResponse.json(
            { message: "Data retrieved", latestBills },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}