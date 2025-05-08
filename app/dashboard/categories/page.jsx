import { validateSession } from "@/config/validateSession";
import { retrieveData } from "@/config/getRequest";
import { cookies } from "next/headers";
import { FaPlus } from "react-icons/fa6";
import AlertError from "@/components/alerts/AlertError";
import AddCategoryButton from "@/components/buttons/AddCategoryButton";
import AlertInfo from "@/components/alerts/AlertInfo";
import CategoryCard from "@/components/cards/CategoryCard";
import CategoriesList from "@/components/CategoriesList";
import DashTitle from "@/components/DashTitle";
import CategoriesMainContent from "@/components/mainContent/CategoriesMainContent";

const apiUrl = process.env.API_URL;

export default async function CategoriesPage() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        if (!sessionToken) {
            throw new Error("Session token is missing");
        }

        return (
            <CategoriesMainContent 
                apiUrl={apiUrl}
                sessionToken={sessionToken}
                userId={session.user.id}
            />
        );
    } catch (error) {
        console.error(error);
        return <AlertError error={error.message} />;   
    }
}
