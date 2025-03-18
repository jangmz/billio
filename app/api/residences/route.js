import { NextResponse } from "next/server";
import { insertResidence, getResidences } from "@/_actions/residenceActions";

// POST /api/residences -> create new residence
export async function POST(req) {
    try {
        // check session -> session.user.id must be the same as residenceData.userId

        const residenceData = await req.json(); // userId, name, address
        console.log("Residence data:", residenceData);

        const residence = await insertResidence(residenceData);

        if (residence.error) throw new Error("Failed to add residence (user may not exist)");

        return NextResponse.json(
            { message: "New residence added", residence },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// GET /api/residences?u -> list of residences for particular user
export async function GET(req) {
    try {
        // check session -> session.user.id must match residenceData.userId

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("u");
        const residences = await getResidences(userId);

        if (residences.error || !userId) throw new Error("Failed to retrieve data");

        return NextResponse.json(
            { message: "Residences retrieved", residences },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}