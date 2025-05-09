import { IoMdArrowRoundBack } from "react-icons/io";
import { validateSession } from "@/config/validateSession";
import { formatDate, formatDateWithTime } from "@/config/formatDate";
import { cookies } from "next/headers";
import Image from "next/image";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import EditResidenceButton from "@/components/buttons/EditResidenceButton";
import DeleteButton from "@/components/buttons/DeleteResidenceButton";
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
                    {/* basic information of the property with image */}
                    <div className="flex justify-center gap-8">
                        <div className="p-6 border-1 border-gray-200 rounded-xl">
                            <h1 className="text-4xl mb-3">{residence.name}</h1>
                            <p>Address: {residence.address}</p>
                            <p>Created: {formatDate(residence.createdAt)}</p>
                            <p>Last updated: {formatDateWithTime(residence.updatedAt)}</p>
                        </div>
                        {/* TODO: insert image */}
                        <Image 
                            src="/cottage_placeholder.jpg" 
                            alt="property image" 
                            width={400} 
                            height={300}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
                        {/* current month expenses chart by category */}
                        <div>
                            <h2 className="text-2xl text-center mb-2">Current Month</h2>
                            {
                                currentMonth.data.length > 0 
                                ? <MonthExpenseChart data={currentMonth.data} />
                                : <AlertInfo information="No data yet." />
                            }
                        </div>
                        {/* last month expenses chart by category */}
                        <div>
                            <h2 className="text-2xl text-center mb-2">Previous Month</h2>
                            
                            {
                                lastMonth.data.length > 0 
                                ? <MonthExpenseChart data={lastMonth.data} />
                                : <AlertInfo information="No data yet." />
                            }
                        </div>
                    </div>
                    {/* table of all expenses by month and category */}
                    <div>
                        <h2 className="text-3xl text-center mb-2">All months</h2>
                        <p className="text-sm text-gray-500 text-center mb-3">Total expenses in categories by month.</p>
                        <div className="relative overflow-x-auto border-1 border-gray-200 sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-base-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Month (year)</th>
                                        {
                                            categories.map(category => (
                                                <th key={category.name} scope="col" className="px-6 py-3">{category.name}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allMonths.data.length > 0 ? 
                                        allMonths.data.map(monthData =>(
                                            <tr key={monthData.month + monthData.year} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{monthData.month} ({monthData.year})</td>
                                                {
                                                    categories.map(category => (
                                                        monthData.categories.map(catData => (
                                                            category.name === catData.category 
                                                            && 
                                                            <td key={category._id} className="px-6 py-4">{`${catData.totalAmount} €` || "No data"}</td>
                                                        ))
                                                    ))
                                                }
                                            </tr>                    
                                        ))
                                        : <tr>
                                            <td>
                                                <AlertInfo information="No data yet." />
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
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
