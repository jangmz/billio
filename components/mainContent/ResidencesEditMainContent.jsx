"use client";

import AlertError from "../alerts/AlertError";
import AlertInfo from "../alerts/AlertInfo";
import EditResidenceButton from "../buttons/EditResidenceButton";
import DeleteButton from "../buttons/DeleteResidenceButton";
import ButtonWithIcon from "../buttons/ButtonWithIcon";
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDate, formatDateWithTime } from "@/config/formatDate";
import Image from "next/image";
import MonthExpenseChart from "../charts/MonthExpenseChart";
import { retrieveData } from "@/config/getRequest";
import { useState, useEffect } from "react";

export default function ResidencesEditMainContent({ apiUrl, sessionToken, userId, residenceId }) {
    const [residence, setResidence] = useState({});
    const [lastMonth, setLastMonth] = useState([]);
    const [allMonths, setAllMonths] = useState([]);
    const [currentMonth, setCurrentMonth] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                //console.log("fetching data...");
                const { residence } = await retrieveData(sessionToken, `${apiUrl}/residences/${residenceId}`); // residence data
                const { lastMonth } = await retrieveData(sessionToken, `${apiUrl}/bills/last-month`, `?residence=${residenceId}`); // last month bills by category
                const { currentMonth } = await retrieveData(sessionToken, `${apiUrl}/bills/current-month`, `?residence=${residenceId}`); // bills for current month
                const { allMonths } = await retrieveData(sessionToken, `${apiUrl}/bills/all-months`, `?residence=${residenceId}`); // bills for present and all past months
                const { categories } = await retrieveData(sessionToken, `${apiUrl}/categories`); // all categories
                //console.log("data fetched.");

                setResidence(residence);
                setLastMonth(lastMonth);
                setCurrentMonth(currentMonth);
                setAllMonths(allMonths);
                setCategories(categories);
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        }

        fetchData();
    }, [sessionToken, userId]);
    
    // updating state on update
    function handleUpdateResidence(updatedResidence) {
        setResidence(updatedResidence);
    }

    if (error) {
        return <AlertError error={error} />;
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex self-end gap-5">
                <EditResidenceButton  
                    residenceData={residence}
                    apiUrl={apiUrl}
                    sessionToken={sessionToken}
                    onResidenceUpdate={handleUpdateResidence}
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
                            currentMonth.length > 0 
                            ? <MonthExpenseChart data={currentMonth} />
                            : <AlertInfo information="No data yet." />
                        }
                    </div>
                    {/* last month expenses chart by category */}
                    <div>
                        <h2 className="text-2xl text-center mb-2">Previous Month</h2>
                        
                        {
                            lastMonth.length > 0 
                            ? <MonthExpenseChart data={lastMonth} />
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
                                    allMonths.length > 0 ? 
                                    allMonths.map(monthData =>(
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
}
