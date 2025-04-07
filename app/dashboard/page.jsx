import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import DashResidenceCard from "@/components/cards/DashResidenceCard";
import DashTitle from "@/components/DashTitle";
import ResidenceSelector from "@/components/ResidenceSelector";
import BigDashExpenses from "@/components/BigDashExpenses";

const apiUrl = process.env.API_URL;

export default async function Dashboard() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // 1) retrieve user residences 
        const residencesResponse = await fetch(`${apiUrl}/residences?u=${session.user.id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!residencesResponse.ok) {
            const errData = await residencesResponse.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error"`);
        }
    
        const { residences } = await residencesResponse.json();
        //console.log("Fetched residences:", residences); // data OK

        // 2) retrieve past 6 months total expenses
        const totalExpensesResponse = await fetch(`${apiUrl}/bills/past-6-months`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!totalExpensesResponse.ok) {
            const errData = await totalExpensesResponse.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error"`);
        }
    
        const totalExpenses = await totalExpensesResponse.json();

        // 3) retrieve user bills - last 10
        const recentBillsResponse = await fetch(`${apiUrl}/bills/latest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!recentBillsResponse.ok) {
            const errData = await recentBillsResponse.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error`);
        }

        const { latestBills } = await recentBillsResponse.json();

        return (
            <div>
                {/* 1st row (residence cards with total expenses for past month) */}
                <DashTitle title="Residences" />
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* TODO: components if there is no data for particular user */}
                    {
                        residences.map((residence) => (
                            <DashResidenceCard key={residence._id} residence={residence} />
                        ))
                    }
                </div>
                {/* 2nd row (total amount per category per residence) */}
                <DashTitle title={"Expenses past 6 months"} />
                <BigDashExpenses residences={residences} expenses={totalExpenses} />
                {/* 3rd row (last 20 bills displayed in a table format) */}
                <DashTitle title={"Recent bills"} />
                <div className="relative overflow-x-auto border-1 border-gray-200 sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-base-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Residence</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Due date</th>
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
                                        <td className="px-6 py-4">{bill.dueDate || "N/A"}</td>
                                        <td className="px-6 py-4">{bill.status}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
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