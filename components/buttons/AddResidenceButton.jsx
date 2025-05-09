"use client";

import { useState } from "react";
import FormFieldset from "../forms/FormFieldset";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";
import Button from "./Button";
import FormFieldsetRequired from "../forms/FormFieldsetRequired";

export default function AddResidenceButton({ text, icon, apiUrl, sessionToken, onAddResidence }) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({ name: "", address: "" });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/residences`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `authjs.session-token=${sessionToken}`
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Unknown error occured.");
            }

            const { message, residence } = await response.json();
            setMessage(message);

            // callback to update the parent state
            if (onAddResidence) {
                onAddResidence(residence);
            }

            // reset form
            setFormData({ name: "", address: "" });
        } catch (error) {
            setError(error.message);
        }
    }

    function handleClick() {
        setMessage(null);
        setError(null);
        document.getElementById("new_residence_modal").showModal();
    }

    return (
        <>
            <button type="button" onClick={handleClick} className="btn btn-primary">
                {icon}
                {text}
            </button>
            <dialog id="new_residence_modal" className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-xl">New residence</h3>
                    <p className="py-4 text-xs">Press ESC or click outside to close</p>
                    <div>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                            {error && <AlertError error={error} />}
                            {message && <AlertSuccess message={message} />}
                            <FormFieldsetRequired
                                title="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                placeholder="Sunset apartment"
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldset
                                title="Address"
                                type="text"
                                name="address"
                                value={formData.address}
                                placeholder="Sand Road 76"
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
                                    onClick={() => document.getElementById("new_residence_modal").close()}
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
