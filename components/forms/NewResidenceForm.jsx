"use client";

import Button from "../buttons/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormFieldset from "./FormFieldset";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";

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
                error && <AlertError error={error.message} />
            }
            {
                message && <AlertSuccess message={message} />
            }
            <FormFieldset
                title="Name"
                type="text"
                name="name"
                value={residenceData.name}
                placeholder="Sunset apartment"
                onChange={(e) => handleChange(e)}
            />
            <FormFieldset
                title="Address"
                type="text"
                name="address"
                value={residenceData.address}
                placeholder="Sand Road 76"
                onChange={(e) => handleChange(e)}
            />
            <Button 
                text={"Create"}
                type={"submit"}
                btnStyle={"btn-primary"}
            />
        </form>
    )
}
