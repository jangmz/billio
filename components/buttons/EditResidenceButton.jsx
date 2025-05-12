"use client";

import { FaEdit } from "react-icons/fa"
import { useEffect, useState } from "react";
import Button from "./Button";
import FormFieldset from "../forms/FormFieldset";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";
import FormFieldsetRequired from "../forms/FormFieldsetRequired";

/*
    TODO: check if residenceData is undefined and why is it not displayed in input
*/

export default function EditButton({ residenceData, apiUrl, sessionToken, className, onResidenceUpdate }) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: residenceData?.name || "",
        address: residenceData?.address || "" 
    });

    useEffect(() => {
        if (residenceData) {
            setFormData({
                name: residenceData.name,
                address: residenceData.address
            });
        }
    }, [residenceData]);

    function handleClick() {
        setMessage(null);
        setError(null);
        document.getElementById("edit_residence_modal").showModal();
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    async function handleSubmit(e) {
        e.preventDefault();
        //console.log("Data to submit:", formData);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch(`${apiUrl}/residences/${residenceData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `authjs.session-token=${sessionToken}`
                },
                body: JSON.stringify(formData)
            });
    
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error);
            }

            const { message, updatedResidence } = await res.json();

            // callback to update the state
            if (onResidenceUpdate) {
                onResidenceUpdate(updatedResidence);
            }

            setMessage(message);
        } catch (error) {
            console.error(error);
            setError(error);
        }
    }
    
    return (
        <>
            <button type="button" onClick={handleClick} className={`flex gap-2 items-center btn btn-outline btn-primary ${className}`}>
                <FaEdit />
                Edit residence
            </button>
            <dialog id="edit_residence_modal" className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-xl">Edit residence data</h3>
                    <p className="py-4 text-xs">Press ESC or click outside to close</p>
                    <div>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                            {
                                error && <AlertError error={error} />
                            }
                            {
                                message && <AlertSuccess message={message} />
                            }
                            <FormFieldsetRequired 
                                title="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldsetRequired 
                                title="Address"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={(e) => handleChange(e)}
                            />
                            <Button
                                text={"Update"}
                                type={"submit"}
                                btnStyle={"btn-primary"}
                            />
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
