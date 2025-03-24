"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./buttons/Button";

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
        <form onSubmit={ handleSubmit } className="justify-center items-center" >
            { 
                error &&
                <p className="text-red-500">
                    { error }
                </p>
            }
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <input type="email" name="email" id="email" placeholder="example@mail.com" className="input" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input type="password" name="password" id="password" className="input" />
            </fieldset>            
            <Button 
                text={"Log in"}
                type={"submit"}
                btnStyle={"btn-primary"}
            />
        </form>
    )
}