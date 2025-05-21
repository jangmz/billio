"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteBillButton from "../buttons/DeleteBillButton";
import EditBillButton from "../buttons/EditBillButton";

export default function BillsTable({ bills, categories, residences, apiUrl, sessionToken, onUpdateBill, onDeleteBill }) {
    return (
        <div className="relative overflow-x-auto border-1 border-gray-200 sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-base-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Residence</th>
                        <th scope="col" className="px-6 py-3">For Month</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bills.map((bill) => (
                            <tr key={bill._id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{bill.residence}</td>
                                <td className="px-6 py-4">{`${bill.forMonth} (${bill.forYear})` || "N/A" }</td>
                                <td className="px-6 py-4">{bill.category}</td>
                                <td className="px-6 py-4">{bill.amount}€</td>
                                <td className="px-6 py-4">{bill.status}</td>
                                <td className="px-6 py-4 flex gap-1">
                                    <EditBillButton
                                        icon={<FaEdit />}
                                        bill={bill}
                                        categories={categories}
                                        residences={residences}
                                        apiUrl={apiUrl}
                                        sessionToken={sessionToken}
                                        onUpdateBill={onUpdateBill}
                                    />
                                    <DeleteBillButton 
                                        icon={<FaTrash />}
                                        billId={bill._id}
                                        apiUrl={apiUrl}
                                        sessionToken={sessionToken}
                                        onDeleteBill={onDeleteBill}
                                    />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}
