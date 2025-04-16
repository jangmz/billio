import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import EditResidenceButton from "@/components/buttons/EditResidenceButton";
import DeleteButton from "@/components/buttons/DeleteResidenceButton";
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDate, formatDateWithTime } from "@/config/formatDate";
import MonthExpenseChart from "@/components/charts/MonthExpenseChart";
import AlertInfo from "@/components/alerts/AlertInfo";

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

        // retrieve bills for present and all past months
        const allMonthsRes = await fetch(`${apiUrl}/bills/all-months?residence=${residence._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            }
        });

        if (!allMonthsRes.ok) {
            const {error} = await allMonthsRes.json();
            throw new Error(`Error: ${error}` || "Unspecified error");
        }
    
        const allMonths = await allMonthsRes.json();

        // retrieve all categories
        const catRes = await fetch(`${apiUrl}/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `authjs.session-token=${sessionToken}`
            }
        });

        if (!catRes.ok) {
            const {error} = await catRes.json();
            throw new Error(`Error: ${error}` || "Unspecified error");
        }
    
        const { categories } = await catRes.json();

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
                <div className="grid gap-4">
                    {/* basic information of the property */}
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div>
                            <h1 className="text-4xl">{residence.name}</h1>
                            <p>{residence.address}</p>
                            <p>Created: {formatDate(residence.createdAt)}</p>
                            <p>Last updated: {formatDateWithTime(residence.updatedAt)}</p>
                        </div>
                        {/* TODO: insert image */}
                        {/*<Image />*/}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
                        {/* current month expenses by category */}
                        <div>
                            <h2 className="text-2xl text-center">Current Month</h2>
                            {
                                currentMonth.data.length > 0 
                                ? <MonthExpenseChart data={currentMonth.data} />
                                : <AlertInfo information="No data yet." />
                            }
                        </div>
                        {/* last month expenses by category */}
                        <div>
                            <h2 className="text-2xl text-center">Previous Month</h2>
                            
                            {
                                lastMonth.data.length > 0 
                                ? <MonthExpenseChart data={lastMonth.data} />
                                : <AlertInfo information="No data yet." />
                            }
                        </div>
                    </div>
                    {/* expenses for past 3 months by category by month */}
                    <div>
                        <h2 className="text-2xl">Expenses for past 3 months by category</h2>
                        {/* TODO: table for expenses by category by last 3 months */}
                        <table>
                            <tr>
                                <th>Month (year)</th>
                                {
                                    categories.map(category => (
                                        <th key={category.name}>{category.name}</th>
                                    ))
                                }
                            </tr>
                            {
                                allMonths.data.length > 0 ? 
                                allMonths.data.map(monthData =>(
                                    <tr key={monthData.month}>
                                        <td>{monthData.month} ({monthData.year})</td>
                                        {
                                            categories.map(category => (
                                                monthData.categories.map(catData => (
                                                    category.name === catData.category && <td key={category._id}>{catData.totalAmount} €</td>
                                                ))
                                            ))
                                        }
                                    </tr>                    
                                ))
                                : <AlertInfo information="No data yet." />
                            }
                        </table>
                    </div>
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
