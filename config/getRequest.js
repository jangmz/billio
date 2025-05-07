// endpoint -> /categories or /categories/[id] ...
// queryParameter -> ?residence=...

export async function retrieveData(sessionToken, apiEndpoint, queryParameter="") {
    const response = await fetch(`${apiEndpoint}${queryParameter}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            Cookie: `authjs.session-token=${sessionToken}` 
        },
        cache: "no-store"
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || `Failed to fetch: ${apiEndpoint}${queryParameter}`);
    }

    const data = await response.json();
    return data;
}