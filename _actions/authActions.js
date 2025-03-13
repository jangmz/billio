"use server";

import { signIn } from "@/config/auth";

export async function handleSignIn(formData) {
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: formData.get("email"),
            password: formData.get("password"),
        });

        if (result.error) {
            throw new Error(result.error);
        } 
        
        return { success: true };
    } catch (error) {
        return { error: "Invalid email or password" };
    }
}