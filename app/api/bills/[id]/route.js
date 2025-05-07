import { NextResponse } from "next/server";
import { deleteBill, getBillByIdAndUser, updateBill } from "@/_actions/billActions";
import { validateSession } from "@/config/validateSession";

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

// GET /api/bills/[id] -> retrieve single bill data
export async function GET(req, { params }) {
    // validate session
    const session = await validateSession();

    try {
        const billId = await params.id;
        const userId = session.user.id;
        const bill = await getBillByIdAndUser(billId, userId);

        if (bill?.error || !bill) throw new Error(bill?.error || "Failed to retrieve bill data");

        return NextResponse.json(
            { message: "Bill retreieved", bill },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// PUT /api/bills/[id] -> update single bill data
export async function PUT(req, { params }) {
    // validate session
    const session = await validateSession();

    try {
        const billData = await req.json();
        billData.id = await params.id;
        billData.userId = session.user.id;
        const updatedBill = await updateBill(billData);

        if (updatedBill?.error || !updatedBill) throw new Error(updateBill?.error || "Failed to updated bill");
        
        return NextResponse.json(
            { message: "Data updated", updatedBill },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// DELETE /api/bills/[id] -> delete single bill
export async function DELETE(req, { params }) {
    // validate session
    const session = await validateSession();

    try {
        const billId = await params.id;
        const userId = session.user.id;
        const deletedBill = await deleteBill(billId, userId);

        if (deletedBill?.error || !deletedBill) throw new Error(deletedBill?.error || "Failed to delete a bill");
        
        return NextResponse.json(
            { message: "Bill deleted", deletedBill },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}