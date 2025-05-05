import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import { FaPlus } from "react-icons/fa6";
import AlertError from "@/components/alerts/AlertError";
import DashTitle from "@/components/DashTitle";
import { retrieveData } from "@/config/getRequest";
import AddBillButton from "@/components/buttons/AddBillButton";

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
                <div className="relative overflow-x-auto border-1 border-gray-200 sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-base-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Residence</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                latestBills.map((bill) => (
                                    <tr key={bill._id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{bill.residence}</td>
                                        <td className="px-6 py-4">{bill.category}</td>
                                        <td className="px-6 py-4">{bill.amount}€</td>
                                        <td className="px-6 py-4">{bill.status}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )        
    } catch (error) {
        console.error(error);
        return <AlertError error={error.message} />; 
    }
}
