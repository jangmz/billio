import { IoMdArrowRoundBack } from "react-icons/io";
import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import ResidencesEditMainContent from "@/components/mainContent/ResidencesEditMainContent";

const apiUrl = process.env.API_URL;

export default async function ResidenceOverviewPage({ params }) {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // residence ID
        const residenceId = params.id;

        return (
            <ResidencesEditMainContent 
                apiUrl={apiUrl}
                sessionToken={sessionToken}
                userId={session.user.id}
                residenceId={residenceId}
            /> 
        )
    } catch (error) {
        console.error("Error in page:", error);
        return (
            <div className="flex flex-col items-center gap-6">
                <div className="flex self-end gap-5">
                    <ButtonWithIcon link="/dashboard/residences" text="Go back" icon={<IoMdArrowRoundBack />}/>
                </div>
                <div role="alert" className="alert alert-error">
                    <span>{error.message}</span>
                </div>
            </div>
        );
    }
}
