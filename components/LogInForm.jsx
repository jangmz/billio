"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogInForm({ signInAction}) {
    const router = useRouter();
    const [error, setError] = useState(null);

    async function handleSubmit(formData) {
        const result = await signInAction(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push("/"); // redirect to home page
            router.refresh(); // refresh the page
        }
    }

    return (
        <form onSubmit={ handleSubmit }>
            { 
                error &&
                <p className="text-red-500">
                    { error }
                </p>
            }
            <label>
                Email
                <input type="email" name="email" id="email" required />
            </label><br/>
            
            <label>
                Password
                <input type="password" name="password" id="password" required />
            </label><br/>
            
            <button type="submit">Sign In</button>
        </form>
    )
}