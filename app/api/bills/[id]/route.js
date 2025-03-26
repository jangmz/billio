import { NextResponse } from "next/server";
import { deleteBill, getBillByIdAndUser, updateBill } from "@/_actions/billActions";
import { authenticate } from "@/config/authMiddleware";

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
    const user = await authenticate(req);
    
    if (user instanceof NextResponse) return user; // if the returned value is NextResponse, return that authentication error
    
    try {
        const billId = await params.id;
        const userId = user.id;
        const bill = await getBillByIdAndUser(billId, userId);

        if (bill?.error || !bill) throw new Error(bill?.error || "Failed to retrieve bill data");

        return NextResponse.json(
            { message: "Bill retreieved", data: bill },
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
    const user = await authenticate(req);
    
    if (user instanceof NextResponse) return user; // if the returned value is NextResponse, return that authentication error
    
    try {
        const billData = await req.json();
        billData.id = await params.id;
        billData.userId = user.id;
        const updatedBill = await updateBill(billData);

        if (updatedBill?.error || !updatedBill) throw new Error(updateBill?.error || "Failed to updated bill");
        
        return NextResponse.json(
            { message: "Data updated", data: updatedBill },
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
    const user = await authenticate(req);
    
    if (user instanceof NextResponse) return user; // if the returned value is NextResponse, return that authentication error
    
    try {
        const billId = await params.id;
        const userId = user.id;
        const deletedBill = await deleteBill(billId, userId);

        if (deletedBill?.error || !deletedBill) throw new Error(deletedBill?.error || "Failed to delete a bill");
        
        return NextResponse.json(
            { message: "Bill deleted", data: deletedBill },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}