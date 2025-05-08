"use client";

import AlertInfo from "./alerts/AlertInfo";
import CategoryCard from "./cards/CategoryCard";

export default function CategoriesList({ categories, apiUrl, sessionToken, onDeleteCategory, onUpdateCategory }) {
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
                            onDeleteCategory={onDeleteCategory}
                            onUpdateCategory={onUpdateCategory}
                        />
                    </div>
                ))
                : <AlertInfo information="No data yet" />
            }
        </div>
    )
}
