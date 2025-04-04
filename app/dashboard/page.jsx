import { auth } from "@/auth";
import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const apiUrl = process.env.API_URL;

export default async function Dashboard() {
    try {
        // validate session
        const session = await validateSession();
        //console.log("Session in dashboard:", session); // session data OK

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // retrieve data
        const response = await fetch(`${apiUrl}/residences?u=${session.user.id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}` // session cookie is sent explicitly
            },
            cache: "no-store"
        });

        /*const response = await fetch(`${apiUrl}/test`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}` // session cookie is sent explicitly
            },
            cache: "no-store"
        });*/

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error"`);
        }
    
        const { residences } = await response.json();
        console.log("Fetched residences:", residences); // data OK

        return (
            <div>
                <h1>Welcome, {session.user.name}</h1>
                <ul>
                    {residences.map((residence) => (
                        <li key={residence._id}>{residence.name}</li>
                    ))}
                </ul>
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