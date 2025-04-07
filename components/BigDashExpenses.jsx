"use client";

import ResidenceSelector from "./ResidenceSelector";
import { useEffect, useState } from "react";

export default function BigDashExpenses({ residences, totalExpenses }) {
    const [selectedResidence, setSelectedResidence] = useState(residences[0]);
    const [displayedExpenses, setDisplayedExpenses] = useState([]);

    console.log(displayedExpenses);

    useEffect(() => {
        console.log("Searching for property:", selectedResidence.name);
        if (!totalExpenses || totalExpenses.length === 0) {
            setDisplayedExpenses([]);
        } else {
            const data = totalExpenses?.find((property) => property.residence === selectedResidence.name);
            setDisplayedExpenses(data ? data.expenses : []);
        }

        console.log("Expenses are set.");
    }, [selectedResidence]);

    function changeResidence(e) {
        e.preventDefault();
        setSelectedResidence(residences.find(res => res._id === e.target.value));
    }

    return (
        <div className="flex flex-col items-start justify-between p-3 h-120 mb-4 rounded-sm bg-gray-200">
            <select onChange={changeResidence} className="rounded-lg p-2 bg-base-100 hover:bg-yellow-400">
                {
                    residences.map((residence) => (
                        <option key={residence._id} value={residence._id} className="hover:bg-yellow-400">
                            {residence.name} ({residence.address})
                        </option>
                    ))
                }
            </select>
            {
                displayedExpenses.length !== 0 ?
                <ul>
                    {
                        displayedExpenses.map((expense) => (
                            <li key={`${expense.month}-${expense.year}`}>
                                Month:{expense.month} ({expense.year}) = {expense.totalExpenses}
                            </li>
                        ))
                    }
                </ul>
                 : 
                <p>No data yet.</p>
            }
        </div>
    );
}