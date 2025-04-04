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
        const response3 = await fetch(`${apiUrl}/bills`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!response3.ok) {
            const errData = await response3.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error`);
        }

        const { bills } = await response3.json();

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
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Residence ID</th>
                                <th>Category ID</th>
                                <th>Amount</th>
                                <th>Due date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bills.map((bill) => (
                                    <tr key={bill._id}>
                                        <td>{bill.residenceId}</td>
                                        <td>{bill.categoryId}</td>
                                        <td>{bill.amount}</td>
                                        <td>{bill.dueDate || "N/A"}</td>
                                        <td>{bill.status}</td>
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