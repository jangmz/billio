import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import DashResidenceCard from "@/components/cards/DashResidenceCard";
import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
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

        // 1) retrieve residences
        const residencesResponse = await fetch(`${apiUrl}/residences?u=${session.user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            },
            cache: "no-store"
        });

        if (!residencesResponse.ok) {
            const { error } = await residencesResponse.json();
            throw new Error(error || "Unspecified error");
        }

        const { residences } = await residencesResponse.json();

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
            throw new Error(`Error: ${errData.error}` || "Unspecified error");
        }
    
        const { totalExpenses } = await totalExpensesResponse.json();

        // helper function for extracting total expenses for past month
        function extractTotalExpenses(residence) {
            const lastMonthExpenses = totalExpenses.find((property) => property.residence === residence.name);
            
            if (!lastMonthExpenses) {
                return null;
            } else {
                return lastMonthExpenses.expenses[lastMonthExpenses.expenses.length - 2].totalExpenses;
            }
        }

        return (
            <div className="flex flex-col gap-6">
                <div className="flex justify-end">
                    <ButtonWithIcon link="/dashboard/residences/new" text="Add Residence" icon={<FaPlus/>} />
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    {
                        residences.length !== 0 &&
                        residences.map((residence) => (
                            <Link key={residence._id} href={`/dashboard/residences/${residence._id}`}>
                                <DashResidenceCard residence={residence} pastMonth={extractTotalExpenses(residence)} />
                            </Link>
                        ))
                    }
                </div>
            </div>            
        );
    } catch (error) {
        console.error("Erro in residences page:", error);
        return (
            <div role="alert" className="alert alert-error">
                <span>Error: {error.message}</span>
            </div>
        )
    }
}