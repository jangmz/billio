"use client";

import { useEffect, useState } from "react"
import Button from "./buttons/Button";
import { Mosaic } from "react-loading-indicators";
import AlertError from "./alerts/AlertError";
import { retrieveData } from "@/config/getRequest";

export default function SuggestionsList({ apiUrl, sessionToken }) {
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSuggestions() {
            try {
                setTimeout(() => {
                    console.log("Retrieve feedbacks from database");
                }, 2000);
                /*
                const { feedbacks } = await retrieveData(sessionToken, `${apiUrl}/suggestions`);
                setSuggestions(feedbacks);*/
            } catch (error) {
                console.error(error);
                setError(error.message)
            } finally {
                setLoading(false);
            }
        }

        fetchSuggestions();
    }, [apiUrl, sessionToken]);

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
