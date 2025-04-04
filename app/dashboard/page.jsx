import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import DashResidenceCard from "@/components/cards/DashResidenceCard";
import DashTitle from "@/components/DashTitle";

const apiUrl = process.env.API_URL;

export default async function Dashboard() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // retrieve data
        const response = await fetch(`${apiUrl}/residences?u=${session.user.id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error"`);
        }
    
        const { residences } = await response.json();
        //console.log("Fetched residences:", residences); // data OK

        return (
            <div>
                {/* 1st row */}
                <DashTitle title="Residences" />
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* TODO: components if there is no data for particular user */}
                    {
                        residences.map((residence) => (
                            <DashResidenceCard key={residence._id} residence={residence} />
                        ))
                    }
                </div>
                {/* 2nd row */}
                <DashTitle title={"Category Overview"} />
                <div className="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                        </svg>
                    </p>
                </div>
                {/* 3rd row */}
                <DashTitle title={"Recent bills"} />
                <div className="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                        </svg>
                    </p>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error in dashboard:", error);
        return (
            <div role="alert" className="alert alert-error">
                <span>Error loading dashboard: {error.message}</span>
            </div>
        );
    }
}