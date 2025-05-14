"use client";

import { useEffect, useState } from "react"
import Button from "./buttons/Button";

export default function SuggestionsList({ suggestionsArr }) {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (suggestionsArr) {
            setSuggestions(suggestionsArr);
        }
    }, [suggestionsArr]);

    return (
        <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Suggestions</h2>
            <div className="grid-cols-1 gap-4">
                {
                    suggestions.length > 0 ? (
                        suggestions.map((suggestion) => (
                            <div key={suggestion._id} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
                                <div className="card-body">
                                    <h3 className="card-title text-lg font-bold">{suggestion.name}</h3>
                                    <p className="text-sm text-gray-500">{suggestion.feedback}</p>
                                    <div className="card-actions justify-end mt-4">
                                        <Button 
                                            text={`Upvote ${suggestion.upvotes}`}
                                            btnStyle={"btn-outline btn-sm"}
                                            //onClick={} // handleUpvote(suggestion._id)
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No suggestions yet.</p>
                    )
                }
            </div>
        </div>
    )
}
