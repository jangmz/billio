import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import { FaPlus } from "react-icons/fa6";
import AlertError from "@/components/alerts/AlertError";
import ButtonWithIcon from "@/components/buttons/ButtonWithIcon";
import AlertInfo from "@/components/alerts/AlertInfo";
import CategoryCard from "@/components/cards/CategoryCard";

const apiUrl = process.env.API_URL;

// endpoint -> /categories or /categories/[id] ...
// queryParameter -> ?residence=...

async function retrieveData(sessionToken, endpoint, queryParameter="") {
    const response = await fetch(`${apiUrl}${endpoint}${queryParameter}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            Cookie: `authjs.session-token=${sessionToken}` 
        }
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Unspecified error occured");
    }

    const data = await response.json();
    //console.log(data);
    return data;
}

export default async function CategoriesPage() {
    try {
        // validate session
        const session = await validateSession();

        // retrieve cookies
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

        // retrieve user categories
        const { categories } = await retrieveData(sessionToken, "/categories");

        return(
            <div className="flex flex-col gap-6">
                <div className="flex justify-end">
                    <ButtonWithIcon link="#" text="New category (dialog)" icon={<FaPlus/>} />
                </div>
                {/* CARDS */}
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
                    {
                        categories.length !== 0 ?
                        categories.map(category => (
                            <div key={category._id} className="flex flex-col">
                                <CategoryCard 
                                    category={category} 
                                    apiUrl={apiUrl}
                                    sessionToken={sessionToken}
                                />
                            </div>
                        ))
                        : <AlertInfo information="No data yet" />
                    }
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        return(
            <AlertError error={error.message} />
        );   
    }
}
