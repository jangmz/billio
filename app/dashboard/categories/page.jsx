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

const apiUrl = process.env.API_URL;

export default async function CategoriesPage() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // retrieve user categories
        const { categories } = await retrieveData(sessionToken, "/categories");

        return (
            <div className="flex flex-col gap-6">
                {/* Title and Top action menu */}
                <div className="flex items-center justify-between">
                    <DashTitle title={"Categories"} />
                    <div className="">
                        <AddCategoryButton 
                            text="New category" 
                            icon={<FaPlus/>} 
                            apiUrl={apiUrl}
                            sessionToken={sessionToken}
                        />
                    </div>
                </div>
                {/* Categories displayed */}
                <CategoriesList 
                    initialCategories={categories}
                    apiUrl={apiUrl}
                    sessionToken={sessionToken}
                />
            </div>
        );
    } catch (error) {
        console.error(error);
        return <AlertError error={error.message} />;   
    }
}
