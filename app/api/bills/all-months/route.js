import { validateSession } from "@/config/validateSession";
import { NextResponse } from "next/server";
import { allMonthsBills } from "@/_actions/billActions";
import { checkRateLimit } from "@/config/checkRateLimit";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// /api/bills/all-months?residence=.... -> current months expenses from all categories
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
        const userId = session.user.id;
        const residenceId = req.nextUrl.searchParams.get("residence");

        if (!residenceId) {
            const error = new Error();
            error.status = 400;
            error.message = "Residence ID is required";
            throw error;
        }

        // last months expenses
        const allMonths = await allMonthsBills(userId, residenceId);

        if (allMonths?.error || !allMonths) {
            throw new Error(allMonths?.error || "Failed to retrieve data.");
        }

        return NextResponse.json(
            { message: "Data retrieved", allMonths },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}