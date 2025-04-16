import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import EditResidenceButton from "@/components/buttons/EditResidenceButton";
import DeleteButton from "@/components/buttons/DeleteResidenceButton";
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDate, formatDateWithTime } from "@/config/formatDate";
import MonthExpenseChart from "@/components/charts/MonthExpenseChart";

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

        // retrieve last month bills by category
        const lastMonthRes = await fetch(`${apiUrl}/bills/last-month?residence=${residence._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            }
        });

        if (!lastMonthRes.ok) {
            const {error} = await lastMonthRes.json();
            throw new Error(`Error: ${error}` || "Unspecified error");
        }
    
        const lastMonth = await lastMonthRes.json();

        // retrieve bills for current month
        const currentBillsRes = await fetch(`${apiUrl}/bills/current-month?residence=${residence._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            }
        });

        if (!currentBillsRes.ok) {
            const {error} = await currentBillsRes.json();
            throw new Error(`Error: ${error}` || "Unspecified error");
        }
    
        const currentMonth = await currentBillsRes.json();

        // retrieve bills for present and last 2 months
        const threeMonthsRes = await fetch(`${apiUrl}/bills/3-months?residence=${residence._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            }
        });

        if (!threeMonthsRes.ok) {
            const {error} = await threeMonthsRes.json();
            throw new Error(`Error: ${error}` || "Unspecified error");
        }
    
        const threeMonths = await threeMonthsRes.json();

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
                {/* basic information of the property */}
                <div className="flex flex-col items-center justify-center gap-3">
                    <h1 className="text-4xl">{residence.name}</h1>
                    <p>{residence.address}</p>
                    <p>Created: {formatDate(residence.createdAt)}</p>
                    <p>Last updated: {formatDateWithTime(residence.updatedAt)}</p>
                </div>
                {/* current month expenses by category */}
                <div>
                    <h2 className="text-2xl">Current Month Expenses</h2>
                    {/* TODO: graph for expenses by category */}
                    <MonthExpenseChart data={currentMonth.data} />
                    {
                        currentMonth.data.length > 0 ? 
                        currentMonth.data.map(cat =>(
                            <p key={cat.category}>{cat.category}: {cat.totalAmount}</p>
                        ))
                        : <p>No data yet.</p>
                    }
                </div>
                {/* last month expenses by category */}
                <div>
                    <h2 className="text-2xl">Last Month Expenses</h2>
                    {/* TODO: graph for expenses by category */}
                    <MonthExpenseChart data={lastMonth.data} />
                    {
                        lastMonth.data.length > 0 ? 
                        lastMonth.data.map(cat =>(
                            <p key={cat.category}>{cat.category}: {cat.totalAmount}</p>
                        ))
                        : <p>No data yet.</p>
                    }
                </div>
                {/* expenses for past 3 months by category by month */}
                <div>
                    <h2 className="text-2xl">Expenses for past 3 months by category</h2>
                    {/* TODO: table for expenses by category by last 3 months */}
                    {
                        threeMonths.data.length > 0 ? 
                        threeMonths.data.map(monthData =>(
                            <div key={monthData.month}>
                                <p key={monthData.month}>{monthData.month} ({monthData.year})</p>
                                {
                                    monthData.categories.map(catData => (
                                        <p key={catData.category}>{catData.category}: {catData.totalAmount}</p>
                                    ))
                                }
                                <hr />
                            </div>
                            
                        ))
                        : <p>No data yet.</p>
                    }
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
