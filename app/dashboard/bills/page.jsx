import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import { FaPlus } from "react-icons/fa6";
import AlertError from "@/components/alerts/AlertError";
import DashTitle from "@/components/DashTitle";
import { retrieveData } from "@/config/getRequest";
import AddBillButton from "@/components/buttons/AddBillButton";
import BillsTable from "@/components/tables/BillsTable";

const apiUrl = process.env.API_URL;
const billsLimit = 50;

export default async function BillsPage() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // retrieve user needed data
        const { latestBills } = await retrieveData(sessionToken, "/bills/latest", `?limit=${billsLimit}`);
        const { categories } = await retrieveData(sessionToken, "/categories");
        const { residences } = await retrieveData(sessionToken, "/residences", `?u=${session.user.id}`);

        return (
            <div className="flex flex-col gap-6">
                {/* title and top action menu */}
                <div className="flex justify-between">
                    <DashTitle title={"Bills"} />
                    <div className="">
                        <AddBillButton
                            text={"New bill"}
                            icon={<FaPlus />}
                            apiUrl={apiUrl}
                            sessionToken={sessionToken}
                            categories={categories}
                            residences={residences}
                        />
                    </div>
                </div>
                {/* table of 50 recent bills */}
                <BillsTable latestBills={latestBills} />
            </div>
        )        
    } catch (error) {
        console.error(error);
        return <AlertError error={error.message} />; 
    }
}
