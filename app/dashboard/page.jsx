import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import DashTitle from "@/components/DashTitle";
import BigDashExpenses from "@/components/BigDashExpenses";
import AlertError from "@/components/alerts/AlertError";
import AlertInfo from "@/components/alerts/AlertInfo";
import ExpenseDisplayCard from "@/components/cards/ExpenseDisplayCard";

const apiUrl = process.env.API_URL;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const now = new Date(); // retrieves current month in number: 0 -> Jan, 1 -> Feb (reffers to months array)

export default async function Dashboard() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("__Secure-authjs.session-token")?.value;

        // 1) retrieve user residences 
        const residencesResponse = await fetch(`${apiUrl}/residences?u=${session.user.id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                Cookie: `__Secure-authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!residencesResponse.ok) {
            const errData = await residencesResponse.json();
            throw new Error(`Error: ${errData.error}` || "Unspecified error");
        }
    
        const { residences } = await residencesResponse.json();

        // 2) retrieve past 6 months total expenses
        const totalExpensesResponse = await fetch(`${apiUrl}/bills/past-6-months`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `__Secure-authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!totalExpensesResponse.ok) {
            const errData = await totalExpensesResponse.json();
            throw new Error(`Error: ${errData.error}` || "Unspecified error");
        }
    
        const { totalExpenses } = await totalExpensesResponse.json();
        //console.log("Dashboard - total expenses past 6 months", totalExpenses);

        // 3) retrieve user bills - last 10
        const recentBillsResponse = await fetch(`${apiUrl}/bills/latest?limit=10`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `__Secure-authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!recentBillsResponse.ok) {
            const errData = await recentBillsResponse.json();
            throw new Error(`Error: ${errData.error} || "Unspecified error`);
        }

        const { latestBills } = await recentBillsResponse.json();

        function combinePastMonthExpenses() {
            let pastMonthExpenses = 0;

            //console.log("combining past month expenses:", months[now.getMonth() - 2])

            totalExpenses.map(property => {
                property.expenses.map(expense => { // in each property check in expenses for past month
                    if (expense.forMonth === months[now.getMonth() - 2]) {
                        pastMonthExpenses += expense.totalExpenses;
                    }
                })
            })

            //console.log("Total expenses for last month:", pastMonthExpenses);
            return pastMonthExpenses;
        }

        function combineCurrentMonthExpenses() {
            let currentMonthExpenses = 0;

            //console.log("combining current month expenses:",months[now.getMonth() - 1]);

            totalExpenses.map(property => {
                property.expenses.map(expense => { // in each property check in expenses for past month
                    if (expense.forMonth === months[now.getMonth() - 1]) {
                        currentMonthExpenses += expense.totalExpenses;
                    }
                })
            })

            //console.log("Total expenses for current month:", currentMonthExpenses);
            return currentMonthExpenses;
        }

        return (
            <div>
                {/* 1st row (residence cards with total expenses for past month) */}
                <DashTitle title={"Total Expenses"} />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <ExpenseDisplayCard 
                        value={combineCurrentMonthExpenses() || 0}
                        text={months[now.getMonth() - 1]}
                    />
                    <ExpenseDisplayCard 
                        value={combinePastMonthExpenses() || 0}
                        text={months[now.getMonth() - 2]}
                    />
                </div>
                {/* 2nd row (total amount per category per residence) */}
                <DashTitle title={"Expenses per residence"} />
                <BigDashExpenses 
                    residences={residences} 
                    totalExpenses={totalExpenses} 
                />
                {/* 3rd row (last 20 bills displayed in a table format) */}
                <DashTitle title={"Recent bills"} />
                <div className="relative overflow-x-auto border-1 border-gray-200 sm:rounded-lg">
                    {
                        latestBills.length !== 0 
                        ? <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-base-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Residence</th>
                                    <th scope="col" className="px-6 py-3">For Month</th>
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
                                            <td className="px-6 py-4">{`${bill.forMonth} (${bill.forYear})` || "N/A" }</td>
                                            <td className="px-6 py-4">{bill.category}</td>
                                            <td className="px-6 py-4">{bill.amount}€</td>
                                            <td className="px-6 py-4">{bill.dueDate || "N/A"}</td>
                                            <td className="px-6 py-4">{bill.status}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        : <AlertInfo information="No data yet." />
                    }
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error in dashboard:", error);
        return (
            <AlertError error={error.message} />
        );
    }
}