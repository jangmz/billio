import { NextResponse } from "next/server";
import { deleteResidenceById, getResidenceData, updateResidenceData } from "@/_actions/residenceActions";
import { validateSession } from "@/config/validateSession";
import { checkRateLimit } from "@/config/checkRateLimit";

// GET /api/residences/[residenceId] -> data for residence
export async function GET(req, { params }) {
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

        // set data
        const userId = session.user.id;
        const residenceId = params.id;
        const residence = await getResidenceData(residenceId, userId);

        if (residence?.error || !residence) throw new Error(residence?.error || "Failed retrieving data");

        return NextResponse.json(
            { message: "Data retrieved", residence },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// PUT /api/residences/[residenceId] -> update residance data
export async function PUT(req, { params }) {
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

        // set data
        const userId = session.user.id;
        const residenceId = params.id;
        const residenceData = await req.json(); // name, address
        const updatedResidence = await updateResidenceData(residenceId, userId, residenceData);

        if (updatedResidence?.error || !updatedResidence) throw new Error(updatedResidence?.error || "Failed updating data");

        return NextResponse.json(
            { message: "Data updated", updatedResidence },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// DELETE /api/residences/[residenceId] -> delete a residence
export async function DELETE(req, { params }) {
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

        // set data
        const userId = session.user.id;
        const residenceId = params.id;
        const deletedResidence = await deleteResidenceById(residenceId, userId);

        if (deletedResidence?.error || !deletedResidence) throw new Error(deletedResidence?.error || "Failed to delete residence");

        return NextResponse.json(
            { message: "Residence deleted", deletedResidence },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}