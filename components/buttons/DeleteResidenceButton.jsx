"use client";

import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function DeleteButton({ className, residenceId, apiUrl, sessionToken }) {
    const router = useRouter();

    async function handleClick() {
        if(!confirm("Are you sure you want to delete this residence?")) {
            return;
        }

        console.log("Deleting:", residenceId);
        
        try {
            const response = await fetch(`${apiUrl}/residences/${residenceId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `authjs.session-token=${sessionToken}`
                }
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Failed to delete residence");
            }

            router.push("/dashboard/residences");
        } catch (error) {
            console.error("Error deleting a residence:", error);
            alert(error || "Failed to delete residence");
        }
    }

    return (
        <button type="button" onClick={handleClick} className={`flex gap-2 items-center btn btn-outline btn-error ${className}`}>
            <FaTrash />
            Delete
        </button>
    )
}
