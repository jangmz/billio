import { validateSession } from "@/config/validateSession";
import { NextResponse } from "next/server";
import { lastMonthExpenses } from "@/_actions/billActions";

// /api/bills/last-month?residence=.... -> last months expenses from all categories
export async function GET(req) {
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
        const lastMonth = await lastMonthExpenses(userId, residenceId);

        if (lastMonth?.error || !lastMonth) {
            throw new Error(lastMonth?.error || "Failed to retrieve data.");
        }

        return NextResponse.json(
            { message: "Data retrieved", lastMonth },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}