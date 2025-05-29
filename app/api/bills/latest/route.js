import { NextResponse } from "next/server";
import { getLatestBills } from "@/_actions/billActions";
import { validateSession } from "@/config/validateSession";
import { checkRateLimit } from "@/config/checkRateLimit";

// /api/bills/latest -> 10 last bills from this user
// /api/bills/latest?limit=50 -> last 50 bills from this user
export async function GET(req) {
    // rate limit check
    const rate = await checkRateLimit(req);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        );
    }

    try {
        // validate session
        const session = await validateSession();

        const { searchParams } = new URL(req.url);
        const billsLimit = parseInt(searchParams.get("limit"));
        const userId = session.user.id;
        const latestBills = await getLatestBills(userId, billsLimit);

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