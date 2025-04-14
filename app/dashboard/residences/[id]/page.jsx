import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import EditResidenceButton from "@/components/buttons/EditResidenceButton";
import DeleteButton from "@/components/buttons/DeleteResidenceButton";
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDate, formatDateWithTime } from "@/config/formatDate";

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

        // retrieve residence data
        const residenceResponse = await fetch(`${apiUrl}/residences/${residenceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            }
        });
        
        if (!residenceResponse.ok) {
            const errData = await residenceResponse.json();
            throw new Error(`Error: ${errData.error}` || "Unspecified error");
        }
    
        const { residence } = await residenceResponse.json();

        return (
            <div className="flex flex-col items-center gap-6">
                <div className="flex self-end gap-5">
                    <EditResidenceButton  
                        residenceData={residence}
                        apiUrl={apiUrl}
                        sessionToken={sessionToken}
                    />
                    <DeleteButton 
                        residenceId={residence._id}
                        apiUrl={apiUrl}
                        sessionToken={sessionToken}
                    />
                    <ButtonWithIcon link="/dashboard/residences" text="Go back" icon={<IoMdArrowRoundBack />}/>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-4xl">{residence.name}</h1>
                    <p>{residence.address}</p>
                    <p>Created: {formatDate(residence.createdAt)}</p>
                    <p>Last updated: {formatDateWithTime(residence.updatedAt)}</p>
                </div>
            </div>  
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
