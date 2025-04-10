"use client";

import Button from "../buttons/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewResidenceForm({ apiUrl, sessionToken }) {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [residenceData, setResidenceData] = useState({ name: "", address: "" });

    // changing form data
    function handleChange(e) {
        const { name, value } = e.target;
        setResidenceData({...residenceData, [name]: value});
    }

    // submitting form data
    async function handleSubmit(e) {
        e.preventDefault();

        if (error) {
            setError(null);
        } else if (message) {
            setMessage(null);
        }

        try {
            const response = await fetch(`${apiUrl}/residences`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `authjs.session-token=${sessionToken}`
                },
                body: JSON.stringify(residenceData)
            });
    
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Unspecified error");
            }

            const { message, residence } = await response.json();
            setResidenceData({ name: "", address: "" });
            setMessage(message);
        } catch (error) {
            setError(error);
        }
    } 

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
            {
                error &&
                <div role="alert" className="alert alert-error">
                    <span>{error.message}</span>
                </div>
            }
            {
                message &&
                <div role="alert" className="alert alert-success">
                    <span>{message}</span>
                </div>
            }
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Name</legend>
                <input type="text" name="name" id="name" value={residenceData.name} placeholder="Sunset apartment" className="input w-100" onChange={(e) => handleChange(e)} />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Address</legend>
                <input type="text" name="address" id="address" value={residenceData.address} placeholder="Rocky Road 12" className="input w-100" onChange={(e) => handleChange(e)} />
            </fieldset>
            <Button 
                text={"Create"}
                type={"submit"}
                btnStyle={"btn-primary"}
            />
        </form>
    )
}
