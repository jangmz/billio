"use client";

import { FaPlus } from "react-icons/fa6";
import AlertError from "../alerts/AlertError";
import DashTitle from "../DashTitle";
import ButtonWithIcon from "../buttons/ButtonWithIcon";
import DashResidenceCard from "../cards/DashResidenceCard";
import { retrieveData } from "@/config/getRequest";
import { useState, useEffect } from "react";
import Link from "next/link";
import AddResidenceButton from "../buttons/AddResidenceButton";
import AlertInfo from "../alerts/AlertInfo";
import { Mosaic } from "react-loading-indicators";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const now = new Date(); // retrieves current month in number: 0 -> Jan, 1 -> Feb (reffers to months array)

export default function ResidencesMainContent({ apiUrl, sessionToken, userId }) {
    const [residences, setResidences] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { residences } = await retrieveData(sessionToken, `${apiUrl}/residences`, `?u=${userId}`);
                const { totalExpenses } = await retrieveData(sessionToken, `${apiUrl}/bills/past-6-months`);
                setResidences(residences);
                setTotalExpenses(totalExpenses);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [sessionToken, userId]);

    // helper function for extracting total expenses for past month
    function extractTotalExpenses(residence) {
        let totalExpense = 0;
        const propertyData = totalExpenses.find((property) => property.residence === residence.name);
        console.log("last month expenses:", propertyData);
        
        if (!propertyData) {
            return null;
        } else {
            propertyData.expenses.map(expense => {
                if (expense.forMonth === months[now.getMonth() - 1]) {
                    totalExpense = expense.totalExpenses;
                }
            });
        }

        return totalExpense;
    }

    // updating state on new inserting
    function handleAddResidence(newResidence) {
        setResidences((prevResidences) => [...prevResidences, newResidence]);
    }

    if (error) {
        return <AlertError error={error} />;
    }

    if (loading) {
        return (    
            <div className="flex h-100 justify-center items-center">
                <Mosaic color="#fbc700" size="medium" text="" textColor="" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* title and top action menu */}
            <div className="flex justify-between">
                <DashTitle title={`Residences (${months[now.getMonth() - 1]})`} />
                <div className="">
                    <AddResidenceButton 
                        text={"New residence"}
                        icon={<FaPlus />}
                        apiUrl={apiUrl}
                        sessionToken={sessionToken}
                        onAddResidence={handleAddResidence}
                    />
                </div>
            </div>
            {/*card*/}
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
                {
                    residences.length !== 0 ?
                    residences.map((residence) => (
                        <div key={residence._id} className="flex flex-col">
                            <Link href={`/dashboard/residences/${residence._id}`}>
                                <DashResidenceCard 
                                    residence={residence} 
                                    totalExpense={extractTotalExpenses(residence)} 
                                />
                            </Link>
                            {/*<Image src={residence.imageUrl} alt={`${residence.name} image`} width={96} height={32} />*/}
                        </div>
                    )) : <AlertInfo information={"No residences yet, create one!"} />
                }
            </div>
        </div>  
    )
}
