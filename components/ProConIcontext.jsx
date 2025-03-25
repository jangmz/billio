"use client";

import React, { useState } from 'react';
import { FaCheck, FaXmark } from "react-icons/fa6";

export default function ProConIcontext({ icon, text }) {
    const [textColor, setTextColor] = useState(() => {
        if (icon === "pro") return "success";
        if (icon === "con") return "error";
        if (icon === "neutral") return "secondary";
    });
  return (
    <div className={`flex items-center gap-2 text-${textColor} py-1`}>
        {
            (icon === "pro" || icon === "neutral") && <FaCheck /> || icon === "con" && <FaXmark />
        }
        {text}
    </div>
  )
}
