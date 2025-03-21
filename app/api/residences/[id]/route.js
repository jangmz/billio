import { NextResponse } from "next/server";
import { deleteResidenceById, getResidenceData, updateResidenceData } from "@/_actions/residenceActions";
import { auth } from "@/config/auth";

// GET /api/residences/[residenceId] -> data for residence
export async function GET(req, { params }) {
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const userId = session.user?.id;
        const residenceId = await params.id;
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
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        
        const userId = session.user?.id;
        const residenceId = await params.id;
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
    try {
        // check session
        const session = await auth();
        
        if (!session) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        
        const userId = session.user?.id;
        const residenceId = await params.id;
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