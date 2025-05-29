import { NextResponse } from "next/server";
import { insertResidence, getResidences, getResidenceByName } from "@/_actions/residenceActions";
import { validateSession } from "@/config/validateSession";
import { checkRateLimit } from "@/config/checkRateLimit";

// POST /api/residences -> create new residence
export async function POST(req) {
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

        const residenceData = await req.json(); // name, address
        residenceData.userId = session.user.id;

        const existingResidence = await getResidenceByName(residenceData.name, residenceData.userId);

        //console.log("Existing residence:", existingResidence);

        if (existingResidence.length !== 0) {
            throw new Error(`Residence with name "${residenceData.name}" already exists for this user`);
        }

        const residence = await insertResidence(residenceData);

        //console.log("Entered residence:", residence);

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
        //console.log("API session:", session); // session data OK

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("u");
        
        if (userId !== session.user.id) {
            const error = new Error("Unauthorized");
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