"use client";

import { useState } from "react";
import FormFieldset from "../forms/FormFieldset";
import FormFieldsetRequired from "../forms/FormFieldset";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";
import Button from "./Button";
import DropdownSelector from "../forms/DropdownSelector";

export default function AddBillButton({ text, icon, apiUrl, sessionToken, categories, residences, onAddBill }) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        category: categories[0]._id,
        residence: residences[0]._id,
        amount: 0,
        dueDate: new Date().getDate(),
        status: "Unpaid",
        recurring: false, // true/false
        recurrencePeriod: null, // monthly, quarterly, yearly, null
        receiptUrl: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        console.log("Submitted form:", formData);

        /*try {
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

            // callback to update the parent state
            if (onAddBill) {
                onAddBill(bill);
            }

            // reset form
            setFormData({
                category: "",
                residence: "",
                amount: 0,
                dueDate: new Date().getDate(),
                status: "Unpaid",
                recurring: false, 
                recurrencePeriod: null, 
                receiptUrl: ""
            });
        } catch (error) {
            setError(error.message);
        }*/
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
                                name={"residence"}
                                options={residences}
                                onChange={(e) => handleChange(e)}
                            />
                            <DropdownSelector
                                text={"Category (required)"}
                                name={"category"}
                                options={categories}
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldsetRequired 
                                title="Amount (required)"
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldset 
                                title="Due date"
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={(e) => handleChange(e)}
                            />
                            <DropdownSelector 
                                text={"Status (required)"}
                                name={"status"}
                                options={["Unpaid", "Paid"]}
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldset 
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
                            />
                            <div className="modal-action">
                                <Button
                                    text={"Create"}
                                    type={"submit"}
                                    btnStyle={"btn-primary"}
                                />
                                <Button
                                    text={"Cancel"}
                                    type={"button"}
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
