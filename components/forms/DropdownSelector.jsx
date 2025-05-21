"use client";

import { useEffect, useState } from "react";

export default function DropdownSelector({ text, name, options, style, currentValue, onChange }) {
    const [selectedValue, setSelectedValue] = useState(options[0]);

    useEffect(() => {
        if (currentValue) {
        setSelectedValue(currentValue);
        }
    }, [currentValue]);

    function changeOption(e) {
        const newValue = e.target.value;
        setSelectedValue(newValue);
        onChange(e);
    }

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{text}</legend>
            <select 
                id={name} 
                name={name} 
                className={`select w-100 ${style}`}
                value={selectedValue}
                onChange={changeOption}
            >
                {
                    options.map((option) => (
                        <option 
                            key={option._id || option} 
                            value={option._id || option}
                        >
                            {option.name || option}
                        </option>
                    ))
                }
            </select>
        </fieldset>
        
    )
}
