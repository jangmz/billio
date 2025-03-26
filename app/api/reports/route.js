import { NextResponse } from "next/server";
import { authenticate } from "@/config/authMiddleware";
import { getReport } from "@/_actions/residenceActions";

// GET /api/reports?timeframe=[mothly/quarterly/yearly] -> return all bills sorted by residence -> sorted bills by category
export async function GET(req) {
    const user = await authenticate(req);
    
    if (user instanceof NextResponse) return user; // if the returned value is NextResponse, return that authentication error
    
    try {
        // retrieve timeframe
        const userId = user.id;
        const { searchParams } = new URL(req.url)
        const timeFrame = searchParams.get("timeframe"); // monthly, quarterly, yearly

        // define timeframe filter based on createdAt -> later change this to dueDate
        let matchStage = {};
        const now = new Date();

        if (timeFrame === "monthly") {
            matchStage = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lte: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                }
            }
        } else if (timeFrame === "quarterly") {
            const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
            matchStage = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), quarterStartMonth, 1),
                    $lt: new Date(now.getFullYear(), quarterStartMonth + 3, 1),
                },
            };
        } else if (timeFrame === "yearly") {
            matchStage = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), 0, 1),
                    $lt: new Date(now.getFullYear() + 1, 0, 1),
                },
            };
        }

        // query
        console.log(userId, matchStage.createdAt.$gte); //ok
        const report = await getReport(userId, matchStage);

        if (report?.error || !report) throw new Error(report?.error || "Failed to create report.");

        return NextResponse.json(
            { message: "Report generated", data: report },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}

/* 
=====  REPORT STRUCTURE =====
Residences [
    Residence {
    name, address, ... // example: Lake Cottage
    Categories [
        Category {
            name, ... // example: Water
            totalAmount: 562.2,
            Bills [
                bill { month: January, amount: 62.5, ...},
                bill { month: February, amount: 78.6, ...},
                bill { month: March, amount: 66.5, ...},
                ... // etc. all other bills
            ]
        },
        Category {
            name, ... // example: Electricity
            totalAmount: 837.3,
            Bills [
                bill { month: January, amount: 62.5, ...},
                bill { month: February, amount: 78.6, ...},
                bill { month: March, amount: 66.5, ...},
                ... // etc. all other bills
            ]
        }, 
        ... // etc. all other categories
    ]
},
... // etc. all other residences
]

*/