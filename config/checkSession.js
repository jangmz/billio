import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function checkSession() {
    const session = await auth();
    
    if (!session) {
        redirect("/login");
    }
}