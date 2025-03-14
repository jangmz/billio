"use server";

import { signIn, signOut } from "@/config/auth";

export async function loginCredentials(formData) {
    try {
        const result = await signIn("credentials", {
            redirectTo: "/",
            formData
        });

        if (result.error) {
            throw new Error(result.error);
        } 
        
        return { success: true };
    } catch (error) {
        return { error: "Invalid email or password" };
    }
}

export async function loginGitHub() {
    await signIn("github", { redirectTo: "/" });
}

export async function logout() {
    await signOut({ redirectTo: "/" });
}