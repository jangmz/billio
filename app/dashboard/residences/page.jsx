import AlertError from "@/components/alerts/AlertError";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import DashResidenceCard from "@/components/cards/DashResidenceCard";
import DashTitle from "@/components/DashTitle";
import ResidencesMainContent from "@/components/mainContent/ResidencesMainContent";
import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const apiUrl = process.env.API_URL;

export default async function Residences() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

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