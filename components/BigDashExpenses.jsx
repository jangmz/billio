"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getLastNMonths(currentMonthIndex, n) {
  const result = [];

  for (let i = 0; i < n; i++) {
    let idx = (currentMonthIndex - i + 12) % 12;
    result.push(months[idx]);
  }
  return result;
}

export default function BigDashExpenses({ residences, totalExpenses }) {
    const [selectedResidence, setSelectedResidence] = useState(residences[0]);
    const [displayedExpenses, setDisplayedExpenses] = useState([]);

    useEffect(() => {
        if (!totalExpenses || totalExpenses.length === 0) {
            setDisplayedExpenses([]);
        } else {
            const data = totalExpenses?.find((property) => property.residence === selectedResidence.name);

            if (data && data.expenses) {
                const now = new Date();
                const currentMonthIndex = now.getMonth(); 
                const lastNMonths = getLastNMonths(currentMonthIndex, 6); 
                const sortedExpenses = [...data.expenses].sort(
                    (a, b) => lastNMonths.indexOf(b.forMonth) - lastNMonths.indexOf(a.forMonth)
                );

                setDisplayedExpenses(sortedExpenses);
            } else {
                setDisplayedExpenses([]);
            }
        }
    }, [selectedResidence]);

    function changeResidence(e) {
        e.preventDefault();
        setSelectedResidence(residences.find(res => res._id === e.target.value));
    }

    const chartData = {
        labels: displayedExpenses.map((expense) => `${expense.forMonth}`),
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
        <div className="flex flex-col items-start justify-between p-3 h-120 mb-4 rounded-sm bg-base-200">
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