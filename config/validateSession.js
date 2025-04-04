import { auth } from "@/auth";

export async function validateSession() {
    const session = await auth();
    if (!session?.user) {
        console.log("Session validation failed");
        throw new Error("Not authenticated");
    }
    console.log("Session validation OK");
    return session;
}