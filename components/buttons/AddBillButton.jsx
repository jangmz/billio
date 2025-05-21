"use client";

import { useState } from "react";
import FormFieldset from "../forms/FormFieldset";
import FormFieldsetRequired from "../forms/FormFieldset";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";
import Button from "./Button";
import DropdownSelector from "../forms/DropdownSelector";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AddBillButton({ text, icon, apiUrl, sessionToken, categories, residences, onAddBill }) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        categoryId: categories[0]?._id,
        residenceId: residences[0]?._id,
        amount: 0,
        forMonth: months[new Date().getMonth() - 1], // default is set to previous month
        forYear: new Date().getFullYear(),
        status: "Unpaid",
        //dueDate: new Date().getDate(),
        //recurring: false, // true/false
        //recurrencePeriod: null, // monthly, quarterly, yearly, null
        //receiptUrl: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        //console.log("Submitted form (button):", formData);

        try {
            const res = await fetch(`${apiUrl}/bills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `authjs.session-token=${sessionToken}`
                },
                body: JSON.stringify(formData)
            });
    
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Unknown error occured.");
            }

            const { message, bill } = await res.json();
            setMessage(message);

            //console.log("Saved bill:", bill);

            // retrieve residence name and category name, to be sent back
            bill.category = categories.find(category => category._id === bill.categoryId).name;
            bill.residence = residences.find(residence => residence._id === bill.residenceId).name;

            // callback to update the parent state
            if (onAddBill) {
                onAddBill(bill);
            }

            // reset form
            setFormData({
                categoryId: bill.categoryId,
                residenceId: bill.residenceId,
                amount: 0,
                forMonth: months[new Date().getMonth() - 1],
                forYear: new Date().getFullYear(),
                status: "Unpaid",
                //dueDate: new Date().getDate(),
                //recurring: false,
                //recurrencePeriod: null,
                //receiptUrl: ""
            });
        } catch (error) {
            setError(error.message);
        }
    }

    function handleClick() {
        setMessage(null);
        setError(null);
        document.getElementById("new_bill_modal").showModal();
    }

    return (
        <>
            <button type="button" onClick={handleClick} className="btn btn-primary">
                {icon}
                {text}
            </button>
            <dialog id="new_bill_modal" className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-xl">New bill</h3>
                    <p className="py-4 text-xs">Press ESC or click outside to close</p>
                    <div>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                            {error && <AlertError error={error} />}
                            {message && <AlertSuccess message={message} />}
                            <DropdownSelector 
                                text={"Residence (required)"}
                                name={"residenceId"}
                                currentValue={formData.residenceId}
                                options={residences}
                                onChange={(e) => handleChange(e)}
                            />
                            <DropdownSelector
                                text={"Category (required)"}
                                name={"categoryId"}
                                options={categories}
                                currentValue={formData.categoryId}
                                onChange={(e) => handleChange(e)}
                            />
                            <div className="flex gap-2">
                                <FormFieldsetRequired 
                                    title="Amount (required)"
                                    type="number"
                                    name="amount"
                                    style={"w-auto"}
                                    value={formData.amount}
                                    onChange={(e) => handleChange(e)}
                                />
                                <DropdownSelector 
                                    text={"Status (required)"}
                                    name={"status"}
                                    options={["Unpaid", "Paid"]}
                                    style={"w-auto"}
                                    currentValue={formData.status}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <DropdownSelector
                                    text={"Month of the bill (required)"}
                                    name={"forMonth"}
                                    options={months}
                                    style={"w-auto"}
                                    currentValue={formData.forMonth}
                                    onChange={(e) => handleChange(e)}
                                />
                                <FormFieldsetRequired 
                                    title="Year of the bill (required)"
                                    type="number"
                                    name="forYear"
                                    style={"w-auto"}
                                    value={formData.forYear}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            {/*<FormFieldset 
                                title="Due date"
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={(e) => handleChange(e)}
                            />*/}
                            {/*<FormFieldset 
                                title="Recurring"
                                type="checkbox"
                                name="recurring"
                                value={formData.recurring}
                                onChange={(e) => handleChange(e)}
                            />
                            <DropdownSelector 
                                text={"Recurrence period"}
                                name={"recurrencePeriod"}
                                options={["", "monthly", "quarterly", "yearly"]}
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldset 
                                title="Receipt URL"
                                type="text"
                                name="receiptUrl"
                                value={formData.receiptUrl}
                                onChange={(e) => handleChange(e)}
                            />*/}
                            <div className="modal-action">
                                <Button
                                    text={"Create"}
                                    type={"submit"}
                                    btnStyle={"btn-primary"}
                                />
                                <Button
                                    text={"Cancel"}
                                    type={"button"}
                                    btnStyle={"btn-error"}
                                    onClick={() => document.getElementById("new_bill_modal").close()}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    );
}
