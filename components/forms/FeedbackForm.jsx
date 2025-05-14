"use client";

import { useState } from "react";
import Button from "../buttons/Button";
import FormFieldset from "./FormFieldset";
import FormTextareaRequired from "./FormTextareaRequired";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";

export default function ContactForm({ user, apiUrl, sessionToken }) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: user.name,
        feedback: "",
    });

    // handle change
    function handleChange(e) {
        const { name, value } = e.target;
        //console.log("Name:",name);
        //console.log("Value:", value);
        setFormData((prevData) => ({ ...prevData, [name]: value}));
    }

    // handle submit
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);
        console.log("Submitted form:", formData);

        setFormData({
            name: user.name,
            feedback: "",
        });

        /*try {
            const response = await fetch(`${apiUrl}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookies: `authjs.session-token=${sessionToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Failed to submit the form")
            }

            const { message } = await response.json();
            setMessage(message);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }*/
    }
    
    return (
        <div className="card w-full max-w-lg bg-base-100">
            <div className="card-body">
                <h2 className="card-title text-xl font-bold">Feedback & Suggestions</h2>
                <p className="text-sm text-gray-500">We value your feedback! Let us know how we can improve. Press ESC or click outside to close.</p>
                {error && <AlertError error={error} />}
                {message && <AlertSuccess message={message} />}
                <form onSubmit={handleSubmit} className="flex-flex-col gap-4">
                    <FormFieldset
                        title={"Your name (optional)"}
                        type={"text"}
                        name={"name"}
                        id={"name"}
                        value={formData.name}
                        style={"w-full"}
                        onChange={(e) => handleChange(e)}
                    />
                    <FormTextareaRequired 
                        title={"Share your thoughts and suggestions"}
                        name={"feedback"}
                        value={formData.feedback}
                        onChange={(e) => handleChange(e)}
                    />
                    <Button 
                        text={"Submit Feedback"}
                        btnStyle={"btn-primary w-full"}
                        type={"submit"}
                    />
                </form>
            </div>
        </div>
    )
}
