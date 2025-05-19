"use client";

import { useState } from "react";
import FormFieldsetRequired from "../forms/FormFieldsetRequired";
import DropdownSelector from "../forms/DropdownSelector";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";
import Button from "./Button";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function EditBillButton({ icon, bill, categories, residences, apiUrl, sessionToken, onUpdateBill }) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({ 
        residenceId: residences.find(residence => residence.name === bill.residence)._id, // finds and sets the ID instead of only the name
        categoryId: categories.find(category => category.name === bill.category)._id, // finds and sets the ID instead of only the name
        amount: bill.amount,
        status: bill.status,
        forMonth: bill.forMonth || months[new Date().getMonth() - 1],
     });

    function handleOpen() {
        setMessage(null);
        setError(null);
        document.getElementById(`edit_bill_modal_${bill._id}`).showModal();
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        //console.log("Submitted data:", formData);

        setMessage(null);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/bills/${bill._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Cookies: `authjs.session-token=${sessionToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Unknown error when updating data.");
            }

            // callback to update state
            const { updatedBill, message } = await response.json();
            updatedBill.residence = residences.find(residence => residence._id === updatedBill.residenceId).name;
            updatedBill.category = categories.find(category => category._id === updatedBill.categoryId).name;
            setMessage(message);
            onUpdateBill(updatedBill);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <button type="button" onClick={handleOpen} className="btn btn-outline btn-primary btn-xs">
                {icon}
            </button>
            <dialog id={`edit_bill_modal_${bill._id}`} className="modal">
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
                                options={residences}
                                currentValue={formData.residenceId}
                                onChange={(e) => handleChange(e)}
                            />
                            <DropdownSelector
                                text={"Category (required)"}
                                name={"categoryId"}
                                options={categories}
                                currentValue={formData.categoryId}
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldsetRequired 
                                title="Amount (required)"
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={(e) => handleChange(e)}
                            />
                            <DropdownSelector
                                text={"Month of the bill (required)"}
                                name={"forMonth"}
                                options={months}
                                currentValue={formData.forMonth}
                                onChange={(e) => handleChange(e)}
                            />
                            <DropdownSelector 
                                text={"Status (required)"}
                                name={"status"}
                                options={["Unpaid", "Paid"]}
                                currentValue={formData.status}
                                onChange={(e) => handleChange(e)}
                            />
                            {/*<FormFieldset 
                                title="Due date"
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={(e) => handleChange(e)}
                            />*/}
                            <div className="modal-action">
                                <Button
                                    text={"Update"}
                                    type={"submit"}
                                    btnStyle={"btn-primary"}
                                />
                                <Button
                                    text={"Cancel"}
                                    type={"button"}
                                    btnStyle={"btn-error"}
                                    onClick={() => document.getElementById(`edit_bill_modal_${bill._id}`).close()}
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
    )
}
