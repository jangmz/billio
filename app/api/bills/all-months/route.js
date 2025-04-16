import { validateSession } from "@/config/validateSession";
import { NextResponse } from "next/server";
import { allMonthsBills } from "@/_actions/billActions";

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

        // change month numbers into month names: 2025-04 -> April
        allMonths.map(monthData => {
            const monthName = months[parseInt(monthData.month.slice(5)) - 1];
            monthData.year = monthData.month.slice(0, 4);
            monthData.month = monthName;
        });

        if (allMonths?.error || !allMonths) {
            throw new Error(allMonths?.error || "Failed to retrieve data.");
        }

        return NextResponse.json(
            { message: "Data retrieved", data: allMonths },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}