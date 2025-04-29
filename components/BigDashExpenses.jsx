"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

export default function BigDashExpenses({ residences, totalExpenses }) {
    const [selectedResidence, setSelectedResidence] = useState(residences[0]);
    const [displayedExpenses, setDisplayedExpenses] = useState([]);

    //console.log(displayedExpenses);

    useEffect(() => {
        //console.log("Searching for property:", selectedResidence.name);
        if (!totalExpenses || totalExpenses.length === 0) {
            setDisplayedExpenses([]);
        } else {
            const data = totalExpenses?.find((property) => property.residence === selectedResidence.name);
            setDisplayedExpenses(data ? data.expenses : []);
        }

        //console.log("Expenses are set.");
    }, [selectedResidence]);

    function changeResidence(e) {
        e.preventDefault();
        setSelectedResidence(residences.find(res => res._id === e.target.value));
    }

    const chartData = {
        labels: displayedExpenses.map((expense) => `${months[expense.month - 1]}`),
        datasets: [
            {
                label: "Total expenses (€)",
                data: displayedExpenses.map((expense) => expense.totalExpenses),
                backgroundColor: "rgba(251, 191, 36, 0.6)",
                borderColor: "rgba(251, 191, 36, 1)",
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true
    };

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
                displayedExpenses.length > 0 ?
                <Bar data={chartData} options={chartOptions} /> :
                <p>No data yet</p>
            }
        </div>
    );
}