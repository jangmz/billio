"use client";

import { FaPlus } from "react-icons/fa6";
import AlertError from "../alerts/AlertError";
import DashTitle from "../DashTitle";
import AddCategoryButton from "../buttons/AddCategoryButton";
import CategoriesList from "../CategoriesList";
import { retrieveData } from "@/config/getRequest";
import { useState, useEffect } from "react";
import { Mosaic } from "react-loading-indicators";

export default function CategoriesMainContent({ apiUrl, sessionToken, userId }) {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { categories } = await retrieveData(sessionToken, `${apiUrl}/categories`);

                setCategories(categories);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [sessionToken, userId]);

    // updating state on inserting new category
    function handleAddCategory(newCategory) {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
    }

    // updating state on deleting a category
    function handleDeleteCategory(categoryId) {
        const tempCategories = categories.filter((category) => category._id !== categoryId);
        setCategories(tempCategories);
    }

    // update state on updating category
    function handleUpdateCategory(updatedCategory) {
        setCategories((prevCategories) =>
            prevCategories.map(category =>
                category._id === updatedCategory._id ? updatedCategory : category
            )
        )
    }

    if (error) {
        return <AlertError error={error} />;
    }
    
    if (loading) {
        return (    
            <div className="flex h-100 justify-center items-center">
                <Mosaic color="#fbc700" size="medium" text="" textColor="" />
            </div>
        );
    }

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
                        onAddCategory={handleAddCategory}
                    />
                </div>
            </div>
            {/* Categories displayed */}
            <CategoriesList 
                categories={categories}
                apiUrl={apiUrl}
                sessionToken={sessionToken}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategory={handleUpdateCategory}
            />
        </div>
    )
}
