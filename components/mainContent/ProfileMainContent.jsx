"use client";

import { logout } from "@/_actions/authActions";
import AvatarImage from "@/components/AvatarImage";
import { useState } from "react";
import AlertError from "../alerts/AlertError";

export default function ProfileMainContent({ userData, apiUrl, sessionToken }) {
    const [error, setError] = useState(null);

    async function handleDeleteAccount() {
        try {
            const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
            if (!confirmed) return;

            // API for deleting account
            /*const response = await fetch(`${apiUrl}/users/${userData.id}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Cookies: `authjs.session-token=${sessionToken}`
                }
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Unknown error when deleting data");
            }*/

            logout();
        } catch (err) {
            console.error(err);
            setError("Failed to delete account. Please try again.");
        }
    }

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <div className="card w-full max-w-md bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                    <AvatarImage
                        src={userData.image || "/default-avatar.png"}
                        width={64}
                        height={64}
                        alt="User Avatar"
                        style={{ objectFit: "cover" }}
                    />
                    <h2 className="card-title">{userData.name || "Anonymous User"}</h2>
                    <p className="text-sm text-gray-500">{userData.email || "No email provided"}</p>
                    <p className="text-sm text-gray-500">Joined: {"N/A"}</p>
                    {error && <AlertError error={error} />}
                    <div className="card-actions mt-4">
                        <button
                            className="btn btn-error btn-outline"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}