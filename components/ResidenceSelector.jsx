"use client";

import { useState } from "react";

export default function ResidenceSelector({ residences }) {
    const [selectedResidence, setSelectedResidence] = useState(residences[0]);

    function changeResidence(e) {
        e.preventDefault();
        setSelectedResidence(residences.find(res => res._id === e.target.value));
    }

    return (
        <div>
            <select id="residence" name="residence" onChange={changeResidence}>
                {
                    residences.map((residence) => (
                        <option key={residence._id} value={residence._id}>{residence.name} ({residence.address})</option>
                    ))
                }
            </select>
        </div>
    )
}
