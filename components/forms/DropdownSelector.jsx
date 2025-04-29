"use client";

import { useState } from "react";

export default function DropdownSelector({ text, name, options, onChange }) {
    const [selectedValue, setSelectedValue] = useState(options[0]);

    function changeOption(e) {
        e.preventDefault();
        setSelectedValue(options.find(res => res._id === e.target.value));
        onChange(e);
    }

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{text}</legend>
            <select id={name} name={name} className="select w-100" onChange={changeOption}>
                {
                    options.map((option) => (
                        <option key={option._id || option} value={option._id || option}>{option.name || option}</option>
                    ))
                }
            </select>
        </fieldset>
        
    )
}
