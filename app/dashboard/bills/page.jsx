import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import AlertError from "@/components/alerts/AlertError";
import BillsMainContent from "@/components/mainContent/BillsMainContent";

const apiUrl = process.env.API_URL;

export default async function BillsPage() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;
        
        if (!sessionToken) {
            throw new Error("Session token is missing");
        }

        return <BillsMainContent 
            apiUrl={apiUrl}
            sessionToken={sessionToken} 
            userId={session.user.id} 
        />;
    } catch (error) {
        console.error(error);
        return <AlertError error={error.message} />;
    }
}
