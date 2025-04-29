"use client";

import { useState } from "react";
import AlertInfo from "./alerts/AlertInfo";
import CategoryCard from "./cards/CategoryCard";

// manages the dynamic state of categories and updates the list when a new category is added
export default function CategoriesList({ initialCategories, apiUrl, sessionToken }) {
    const [categories, setCategories] = useState(initialCategories);

    async function handleAddCategory(newCategory) {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
    };

    return (
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
    )
}
