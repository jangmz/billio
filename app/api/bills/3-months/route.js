import { validateSession } from "@/config/validateSession";
import { NextResponse } from "next/server";
import { threeMonthsBills } from "@/_actions/billActions";

// /api/bills/3-months?residence=.... -> current months expenses from all categories
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
        const threeMonths = await threeMonthsBills(userId, residenceId);

        if (threeMonths?.error || !threeMonths) {
            throw new Error(threeMonths?.error || "Failed to retrieve data.");
        }

        return NextResponse.json(
            { message: "Data retrieved", data: threeMonths },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}