"use client";

import { FaPlus } from "react-icons/fa6";
import AlertError from "@/components/alerts/AlertError";
import DashTitle from "@/components/DashTitle";
import { retrieveData } from "@/config/getRequest";
import AddBillButton from "@/components/buttons/AddBillButton";
import BillsTable from "@/components/tables/BillsTable";
import { useState, useEffect } from "react";

const billsLimit = 50;

export default function BillsMainContent({ apiUrl, sessionToken, userId }) {
    const [bills, setBills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [residences, setResidences] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {          
                console.log("Fetching data...");      
                // retrieve user needed data
                const { latestBills } = await retrieveData(sessionToken, `${apiUrl}/bills/latest`, `?limit=${billsLimit}`);
                const { categories } = await retrieveData(sessionToken, `${apiUrl}/categories`);
                const { residences } = await retrieveData(sessionToken, `${apiUrl}/residences`, `?u=${userId}`);

                console.log("Bills:", latestBills);
                console.log("Categories:", categories);
                console.log("Residences:", residences);                

                setBills(latestBills);
                setCategories(categories);
                setResidences(residences);
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        }

        fetchData();
    }, [sessionToken, userId]);

    // update bills on insert
    function handleAddBill(newBill) {
        setBills((prevBills) => [newBill, ...prevBills]);
    }

    // update bills on delete
    function handleDeleteBill(billId) {
        const tempBills = bills.filter((bill) => bill._id !== billId);
        setBills(tempBills);
    }

    if (error) {
        return <AlertError error={error} />;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* title and top action menu */}
            <div className="flex justify-between">
                <DashTitle title={"Bills"} />
                <div className="">
                    <AddBillButton
                        text={"New bill"}
                        icon={<FaPlus />}
                        apiUrl={apiUrl}
                        sessionToken={sessionToken}
                        categories={categories}
                        residences={residences}
                        onAddBill={handleAddBill} // passing callback for updating state on new insert
                    />
                </div>
            </div>
            {/* table of 50 recent bills */}
            <BillsTable 
                bills={bills} 
                apiUrl={apiUrl}
                sessionToken={sessionToken}
                onDeleteBill={handleDeleteBill} // passing callback for updating state on delete
            />
        </div>
    );
}