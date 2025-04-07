import { NextResponse } from "next/server";
import { totalExpensesHalfYear } from "@/_actions/billActions";
import { validateSession } from "@/config/validateSession";

// /api/bills/past-6-months -> total expenses by months for past 6 months
export async function GET(req) {
    try {
        // validate session
        const session = await validateSession();

        const userId = session.user.id;
        const totalExpenses = await totalExpensesHalfYear(userId);

        if (totalExpenses?.error || !totalExpenses) {
            throw new Error(totalExpenses?.error || "Failed to retrieve latest bills.");
        }

        return NextResponse.json(
            { message: "Data retrieved", totalExpenses },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}