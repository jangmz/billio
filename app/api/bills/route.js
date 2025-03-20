import { NextResponse } from "next/server";
import { getUserBills, insertBill } from "@/_actions/billActions";

/*
===== BILL MODEL =====
{
    userId,
    residenceId,
    categoryId,
    amount (number),
    dueDate (optional),
    status (paid / unpaid),
    recurring (bool optional),
    recurrencePeriod (monthly, quarterly, yearly, null),
    receiptUrl (optional),
}
*/

// POST /api/bills -> create new bill
export async function POST(req) {
    try {
        const billData = await req.json(); // make sure category and residence is in the form
        billData.userId = "67d4290bbe6ed5a063405432"; // retrieve id from request

        const bill = await insertBill(billData);

        if (bill?.error || !bill) throw new Error(bill?.error || "Failed to create new bill");

        return NextResponse.json(
            { message: "Bill created", data: bill },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// GET /api/bills -> returns all bills by user ID
export async function GET(req) {
    try {
        const userId = "67d4290bbe6ed5a063405432"; // retrieve id from request
        const bills = await getUserBills(userId);

        if (bills?.error || !bills) throw new Error(bills.error || "Failed to get data");

        return NextResponse.json(
            { message: "Bills retrieved", data: bills },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}