"use client";

import { FaEdit } from "react-icons/fa"
import { useState } from "react";
import Button from "./Button";
import FormFieldset from "../forms/FormFieldset";

export default function EditButton({ residenceData, apiUrl, sessionToken, className }) {
    const [formData, setFormData] = useState({
        name: residenceData.name,
        address: residenceData.address 
    });
    
    function handleClick() {
        document.getElementById("edit_residence_modal").showModal();
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Data to submit:", formData);
    }
    
    return (
        <>
            <button type="button" onClick={handleClick} className={`flex gap-2 items-center btn btn-outline btn-primary ${className}`}>
                <FaEdit />
                Edit residence
            </button>
            <dialog id="edit_residence_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit residence data</h3>
                    <p className="py-4 text-xs">Press ESC or click outside to close</p>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <FormFieldset 
                                title="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange(e)}
                            />
                            <FormFieldset 
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
