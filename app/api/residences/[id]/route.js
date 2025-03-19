import { NextResponse } from "next/server";
import { deleteResidenceById, getResidenceData, updateResidenceData } from "@/_actions/residenceActions";

// GET /api/residences/[residenceId] -> data for residence
export async function GET(req, { params }) {
    try {
        // get userId from session
        const userId = "67d4290bbe6ed5a063405432"; // change later -> grab from session
        const residenceId = await params.id;
        const residence = await getResidenceData(residenceId, userId);

        if (residence?.error || !residence) throw new Error("Failed retrieving data");

        return NextResponse.json(
            { message: "Data retrieved", residence },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/residences/[residenceId] -> update residance data
export async function PUT(req, { params }) {
    try {
        // get userId from session
        const userId = "67d4290bbe6ed5a063405432"; // change later
        const residenceId = await params.id;
        const residenceData = await req.json(); // name, address
        const updatedResidence = await updateResidenceData(residenceId, userId, residenceData);

        if (updatedResidence?.error || !updatedResidence) throw new Error("Failed updating data");

        return NextResponse.json(
            { message: "Data updated", updatedResidence },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/residences/[residenceId] -> delete a residence
export async function DELETE(req, { params }) {
    try {
        // get userId from session
        const userId = "67d2ab0cb46d21c7763f9ab3";
        const residenceId = await params.id;
        const deletedResidence = await deleteResidenceById(residenceId, userId);

        if (deletedResidence?.error || !deletedResidence) throw new Error("Failed to delete residence");

        return NextResponse.json(
            { message: "Residence deleted", deletedResidence },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}