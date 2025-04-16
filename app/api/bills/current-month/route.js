import { validateSession } from "@/config/validateSession";
import { NextResponse } from "next/server";
import { currentMonthBills } from "@/_actions/billActions";

// /api/bills/current-month?residence=.... -> current months expenses from all categories
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
        const currentMonth = await currentMonthBills(userId, residenceId);

        if (currentMonth?.error || !currentMonth) {
            throw new Error(currentMonth?.error || "Failed to retrieve data.");
        }

        return NextResponse.json(
            { message: "Data retrieved", data: currentMonth },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}