import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import DashResidenceCard from "@/components/cards/DashResidenceCard";
import DashTitle from "@/components/DashTitle";
import ResidenceSelector from "@/components/ResidenceSelector";

const apiUrl = process.env.API_URL;

export default async function Dashboard() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // retrieve user residences 
        const response = await fetch(`${apiUrl}/residences?u=${session.user.id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error"`);
        }
    
        const { residences } = await response.json();
        //console.log("Fetched residences:", residences); // data OK

        // retrieve user categories
        const response2 = await fetch(`${apiUrl}/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!response2.ok) {
            const errData = await response2.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error"`);
        }

        const { categories } = await response2.json();

        // retrieve user bills
        const recentBills = await fetch(`${apiUrl}/bills/latest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!recentBills.ok) {
            const errData = await recentBills.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error`);
        }

        const { latestBills } = await recentBills.json();

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
                <DashTitle title={"Category Overview"} />
                <div className="flex flex-col items-start justify-between p-3 h-120 mb-4 rounded-sm bg-gray-200">
                    <ResidenceSelector residences={residences} />
                    <ul className="flex">
                        {
                            categories.map((category) => (
                                <li key={category._id}>{category.name}</li>
                            ))
                        }
                    </ul>
                </div>
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