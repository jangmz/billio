"use client";

import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend, CartesianGrid } from "recharts";

export default function MonthExpenseChart({ data }) {
    return (
        <BarChart width={400} height={300} data={data}>
            <XAxis dataKey="category" stroke="rgb(210, 137, 2)" />
            <YAxis />
            <Tooltip wrapperStyle={{ width: 200, backgroundColor: "rgb(229 231 235)" }} />
            <Bar dataKey="totalAmount" fill="#fbc700" barSize={60} />
        </BarChart>
    );
}
