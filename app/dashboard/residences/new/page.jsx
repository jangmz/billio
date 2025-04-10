import { validateSession } from "@/config/validateSession";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import NewResidenceForm from "@/components/forms/NewResidenceForm";
import { IoMdArrowRoundBack } from "react-icons/io";
import { cookies } from "next/headers";

const apiUrl = process.env.API_URL;

export default async function NewResidencePage() {
    // validate session
    const session = await validateSession();

    // retrieve cookies
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex self-end">
                <ButtonWithIcon link="/dashboard/residences" text="Go back" icon={<IoMdArrowRoundBack />}/>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 border-1 rounded-2xl border-base-300 shadow-2xl p-7">
                <h1 className="text-4xl">Enter new residence</h1>
                <NewResidenceForm  apiUrl={apiUrl} sessionToken={sessionToken} />
            </div>
        </div>      
    )
}
