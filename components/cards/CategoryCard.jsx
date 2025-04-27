"use client";

import FormFieldset from "../forms/FormFieldset";
import AlertError from "../alerts/AlertError";
import AlertSuccess from "../alerts/AlertSuccess";
import Button from "../buttons/Button";
import { useState } from "react";

export default function CategoryCard({ category, apiUrl, sessionToken }) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: category.name,
    });

    // changing form data
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // delete category
    function handleDelete() {
        // delete api call, ask for confirmation
        console.log("Delete:", category.name);
    }

    // updating data
    async function handleSubmit(e) {
        e.preventDefault();

        setMessage(null);
        setError(null);

        console.log("Data for update:", formData);

        try {
            const res = await fetch(`${apiUrl}/categories/${category._id}`, {
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

            const { message } = await res.json();
            setMessage(message);
        } catch (error) {
            console.error(error);
            setError(error);
        }
    }

    // for opening dialog box
    function handleClick() {
        document.getElementById(`update_category_${category._id}_modal`).showModal();
    }

    return (
        <>
            <button type="button" onClick={handleClick} className="hover:cursor-pointer">
                <div className="flex items-center justify-center h-32 rounded-sm p-3 bg-gray-200">
                    <p className="text-3xl">{category.name}</p>
                </div>
            </button>
            <dialog id={`update_category_${category._id}_modal`} className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-xl">Edit category</h3>
                    <p className="py-4 text-xs">Press ESC or click outside to close</p>
                    <div>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                            {
                                error && <AlertError error={error} />
                            }
                            {
                                message && <AlertSuccess message={message} />
                            }
                            <FormFieldset 
                                title="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange(e)}
                            />
                            <div className="flex gap-5">
                                <Button
                                    text={"Update"}
                                    type={"submit"}
                                    btnStyle={"btn-primary"}
                                />
                                <Button
                                    text={"Delete"}
                                    type={"button"}
                                    btnStyle={""}
                                    onClick={handleDelete}
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
