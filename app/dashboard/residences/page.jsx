import AlertError from "@/components/alerts/AlertError";
import ResidencesMainContent from "@/components/mainContent/ResidencesMainContent";
import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";

const apiUrl = process.env.API_URL;

export default async function Residences() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("__Secure-authjs.session-token")?.value;

        return (
            <ResidencesMainContent 
                apiUrl={apiUrl}
                sessionToken={sessionToken}
                userId={session.user.id}
            />  
        );
    } catch (error) {
        console.error("Error in residences page:", error);
        return (
            <AlertError error={error.message} />
        )
    }
}