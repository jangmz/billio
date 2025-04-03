import { NextResponse } from "next/server";
import { insertResidence, getResidences } from "@/_actions/residenceActions";
import { auth } from "@/auth";

// POST /api/residences -> create new residence
export async function POST(req) {
    const session = await auth(req);
    if (!session) return NextResponse.json({ message: "Not authorized"}, { status: 403 });

    try {
        const residenceData = await req.json(); // name, address
        residenceData.userId = session.user?.id;

        const residence = await insertResidence(residenceData);

        if (residence?.error || !residence) throw new Error(residence?.error || "Failed to add residence (user may not exist)");

        return NextResponse.json(
            { message: "New residence added", residence },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

// GET /api/residences?u -> list of residences for particular user
export async function GET(req) {

    /*  */
    const session = await auth(req);
    if (!session) return NextResponse.json({ message: "Not authorized"}, { status: 403 });

    console.log("Log session:",session);

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("u");
        
        if (userId !== session.user?.id) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        const residences = await getResidences(userId);

        if (residences.error || !userId) throw new Error(residences?.error || "Failed to retrieve data");

        return NextResponse.json(
            { message: "Residences retrieved", residences },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}